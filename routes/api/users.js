const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const app = express();
const models = require('../../models');
const { authJwt, verifySignUp } = require('../../middlewares');
const configs = require('../../configs');
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

app.get('/', [ authJwt.verifyToken, authJwt.isAdmin ], (req, res) => {
	User.find({})
	.populate("roles", "-__v")
	.exec((err, result) => {
		if (err) {
			response.error(err, res);
			return;
		}
		else {
			if (_.isEmpty(result)) {
				response.notFound('No data', res);
				return;
			}
			let data = [];
			result.forEach((o) => {
				var authorities = [];

				for (let i = 0; i < o.roles.length; i++) {
					authorities.push("ROLE_" + o.roles[i].name.toUpperCase());
				}
				data.push({
					id: o._id,
					username: o.username,
					email: o.email,
					roles: authorities
				})
			})
			response.success(data, 'Show '+data.length+' data', res);
		}
	})
})

app.get('/create',
[ authJwt.verifyToken, authJwt.isAdmin ],
(req, res) => {
	response.success({
		username: '',
		email: '',
		password: '',
		roles: []
	}, 'Create data', res);
})

app.post('/create',
[ authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateUsernameOrEmail,  verifySignUp.checkRolesExisted ],
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

					response.success(user, "User inserted", res);
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

					response.success(user, "User inserted", res);
				});
			});
		}
	});
})

app.get('/edit/:id',
[ authJwt.verifyToken, authJwt.isAdmin, authJwt.isUser ],
(req, res) => {
	User.findById(req.params.id)
	.populate("roles", "-__v")
	.exec((err, row) => {
		if (err) {
			response.error(err, res);
			return;
		}
		else {
			if (_.isEmpty(row)) {
				response.notFound('No data', res);
				return;
			}
			var authorities = [];

			for (let i = 0; i < row.roles.length; i++) {
				authorities.push(row.roles[i].name);
			}

			response.success({
				id: row._id,
				username: row.username,
				email: row.email,
				roles: authorities
			}, 'User found', res);
		}
	})
})

app.put('/edit/:id',
[ authJwt.verifyToken, authJwt.isAdmin, authJwt.isUser, verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted ],
(req, res) => {
	var data = {
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	};

	Role.find( 
		{
			name: { $in: req.body.roles }
		},
		(errRole, roles) => {
			if (errRole) {
				response.error(err, res);
				return;
			}
			data.roles = roles.map(role => role._id);
			User.findByIdAndUpdate({_id: req.params.id}, data, (errUpdate, docs) => {
				if (errUpdate) {
					response.error(errUpdate, res);
					return;
				}

				response.success(docs, 'Data updated', res);
			})
		}
	)
})

app.delete('/delete/:id',
[ authJwt.verifyToken, authJwt.isAdmin ],
(req, res) => {
	User.findByIdAndDelete({_id: req.params.id}, (err, docs) => {
		if (err) {
			response.error(errUpdate, res);
			return;
		}

		response.deleted(docs, 'Data deleted', res);
	})
})

app.get('/role', [ authJwt.verifyToken, authJwt.isAdmin ], (req, res) => {
	Role.find({}).exec((err, result) => {
		if (err) {
			response.error(err, res);
			return;
		}
		else {
			if (result.length == 0) {
				response.notFound('No data', res);
				return;
			}
			response.success(result, 'Show '+result.length+' data', res);
		}
	})
})


module.exports = app;