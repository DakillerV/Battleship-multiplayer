const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const roomSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      require,
    },
    initiator: {
      type: String,
      default: "",
    },
    ownerId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
      require,
    },
    members: {
      type: Array,
      default: [],
    },
    messages: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

roomSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Rooms", roomSchema, "Rooms");
