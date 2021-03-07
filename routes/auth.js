const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const models = require('../models');
const configs = require('../configs');
const auth = configs.authJwt;
const { verifySignUp } = require('../middlewares');
const response = configs.response;

const User = models.user;
const Role = models.role;

app.use(function(req, res, next) {
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token, Origin, Content-Type, Accept"
	);
	next();
});

app.post('/', (req, res) => {	
	User.findOne({
		username: req.body.username
	})
	.populate("roles", "-__v")
	.exec((err, user) => {
		if (err) {
			response.error(err, res);
			return;
		}

		if (!user) {
			return response.notFound("User not found.", res);
		}

		var passwordIsValid = bcrypt.compareSync(
			req.body.password,
			user.password
		);

		if (!passwordIsValid) {
			return response.invalid("Invalid password!", res);
		}

		var token = jwt.sign({ id: user.id }, auth.secret, {
			expiresIn: 86400 // 24 hours
		});

		var authorities = [];

		for (let i = 0; i < user.roles.length; i++) {
			authorities.push("ROLE_" +  user.roles[i].name.toUpperCase());
		}
		response.success({
			id: user._id,
			username: user.username,
			email: user.email,
			roles: authorities,
			accessToken: token
		}, 'User found', res);
	});
})

app.post('/signup',
[ verifySignUp.checkDuplicateUsernameOrEmail,  verifySignUp.checkRolesExisted ],
(req, res) => {
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	});

	user.save((err, user) => {
		if (err) {
			response.error(err, res);
			return;
		}

		if (req.body.roles) {
			Role.find(
				{
					name: { $in: req.body.roles }
				},
				(err, roles) => {
					if (err) {
						response.error(err, res);
						return;
					}

					user.roles = roles.map(role => role._id);
					user.save(err => {
					if (err) {
						response.error(err, res);
						return;
					}

					response.success(user, "User was registered successfully!", res);
					});
				}
			);
		} else {
			Role.findOne({ name: "user" }, (err, role) => {
			if (err) {
				response.error(err, res);
				return;
			}

			user.roles = [role._id];
			user.save(err => {
					if (err) {
						response.error(err, res);
						return;
					}

					response.success(user, "User was registered successfully!", res);
				});
			});
		}
	});
})
module.exports = app;