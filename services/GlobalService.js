const functions = require("../util/functions.js");

module.exports = {

  keyCreate: async (req, res) => {
    try {
      res.send({
        success: true,
        apiKey: "134234",
        message: `Key Created`,
      });
    } catch (error) {
      console.log(error);
      res.send({ success: false, error });
    }
  },
  addDeveloper: async (req, res) => {
    try {
      res.send({
        success: true,
        apiKey: "134234",
        message: `Key Created`,
      });
    } catch (error) {
      console.log(error);
      res.send({ success: false, error });
    }
  },
  
};
