const rateLimit = require("express-rate-limit");
const RateLimitStore = require("rate-limit-mongo");
require("dotenv/config");

module.exports = rateLimit({
  max: 1000,
  message:
    "Wow, Calm down why are you trying to slow me down. (code:429 Rate Limit)",
  store: new RateLimitStore({ uri: process.env.MONGO_URI }),
  windowMs: 60 * 1000,
});
