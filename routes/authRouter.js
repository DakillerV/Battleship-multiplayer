const jwt = require("jsonwebtoken");
// const { handleApiRequest, encode } = require("../functions.js");
const express = require("express");
const passport = require("passport");
const fetch = require("node-fetch");
const formData = require("form-data");
const functions = require("../util/functions");
require("dotenv/config");

const router = express.Router();
router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.PROXY_URL}/`,
    failureRedirect: `${process.env.PROXY_URL}/error?error=auth`,
  })
);

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error logging out" });
    } else {
      res.send({ success: true, message: "Successfully logged out" });
    }
  });
});
router.get("/current-session", async (req, res) => {
  if (req.isAuthenticated()) {
    const userData = req.user.userData;
    const baseData = { ...req.user };
    let user = await functions.getUserById(userData.id, false);
    if (isEmpty(user)) {
      user = await functions.addUser(userData.id, {
        googleData: userData,
        email: userData.email,
        name: userData.displayName,
      });
      console.log(`[Log] User create: ${userData.id}`);
    }
    baseData.userData = user;
    return res.send({ login: true, userData: baseData });
  } else {
    return res.send({ login: false });
  }
});

module.exports = router;
