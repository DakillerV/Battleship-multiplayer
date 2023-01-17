const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const globalScheme = new mongoose.Schema(
  {
    buildId: String,
    buildVersion: String,
    developers: { type: Array, default: [] },
    apiKeys: { type: Array, default: [] },
    settings: {
      type: Object,
      default: { maintenance: { enabled: false, message: "" } },
    },
    data: {
      type: Object, 
      default: { themes: [], updateLog: []}
    }
  },
  { timestamps: true }
);

globalScheme.plugin(mongoosePaginate);
module.exports = mongoose.model("Global", globalScheme, "global");
