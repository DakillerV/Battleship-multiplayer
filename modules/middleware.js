const sessions = require("./sessions");
const express = require("express");
const passport = require("passport");
const { sendError } = require("./api-utils");
const { bot } = require("../../bot");

module.exports.updateGuilds = async (req, res, next) => {
  try {
    const key = res.cookies.get("key") ?? req.get("Authorization");
    if (key) {
      const { guilds } = await sessions.get(key);
      res.locals.guilds = guilds;
    }
  } finally {
    return next();
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const key = res.cookies.get("key") ?? req.get("Authorization");
    if (key) {
      const { authUser } = await sessions.get(key);
      res.locals.user = authUser;
    }
  } finally {
    return next();
  }
};


module.exports.validateOwner = async (req, res, next) => {
  if(!res.locals.user) {
    return res.render("errors/404");
  }
  if(res.locals.user.id !== '396800981326757889') {
    return res.render("errors/404");
  }
  next()
};

module.exports.isAuth = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.send({ error: "Not auth", status: "failed"})
    } else {
      next()
    }
  })(req, res);
};

module.exports.validateGuild = async (req, res, next) => {
  let guild = req.session.guilds.find((g) => g.id === req.params.id);
  return guild ? next() : res.send({ success: false, error: "Server Not Found"});
};

module.exports.validateUser = async (req, res, next) => {
  return res.locals.user ? next() : res.send({ success: false, error: "User Not Found"});
};
