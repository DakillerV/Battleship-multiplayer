const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const gameSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      require,
    },
    word: {
      type: String,
      default: "",
    },
    players: {
        type: Array,
        default: []
    },
    started: {
      type: Boolean,
      default: false
    },
    startedBy: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

gameSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Games", gameSchema, "Games");
