const db = require("../models");
const { response } = require("../configs");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      response.error(err, res);
      return;
    }

    if (user) {
      response.inused("Failed! Username is already in use!", res);
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        response.error(err, res);
        return;
      }

      if (user) {
        response.inused("Failed! Email is already in use!", res);
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        response.notFound("Failed! Role ${req.body.roles[i]} does not exist!", res);
        return;
      }
    }
  }

  next();
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};