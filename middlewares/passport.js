const passport = require("passport");
require("dotenv/config");
const jwtSecret = process.env.SESSION_SECRET;
const Auth0Strategy = require("passport-auth0");
const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const auth0Strategy = new Auth0Strategy(
  {
    domain: "sedsadasd",
    clientID: "sdsda",
    clientSecret: "process.env.AUTH0_SECRET",
    callbackURL: "process.env.AUTH0_CALLBACK_URL",
    secrete: "sdsa",
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    console.log("pp");
    return done(null, profile);
  }
);

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: (req) => req.session.jwt,
    secretOrKey: jwtSecret,
  },
  (payload, done) => {
    // TODO: add additional jwt token verification
    return done(null, payload);
  }
);

const google = new GoogleStrategy(
  {
    clientID:
      "178262874702-b00dcephafomv4gg2aglc0dqjupdlb2i.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/api/auth/callback",
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.userData = profile;
    const data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userData: profile,
    };
    return done(null, data);
  }
);
passport.use(google);
passport.use(jwtStrategy);

module.exports = passport;
