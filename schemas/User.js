const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    email: String,
    userName: {type: String, default: ""},
    tag: {type: String, default: "tag"},
    googleData: { type: Object, default: {} },
    matches: { type: Array, default: [] },
    chats: { type: Array, default: [] },
    friends: { type: Array, default: [] },
    Frequests: { type: Array, default: [] },
    initiated: false,
    settings: { type: Object, default: {
      showFriends: "everyone", 
      showRecentMatches: "everyone",
    } },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Users", userSchema, "users");
