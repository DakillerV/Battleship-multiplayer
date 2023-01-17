const router = require("express").Router();

router.use("/auth", require("./authRouter"));
router.use("/rooms", require("./RoomRouter"));
router.use("/user", require("./userRouter"));
router.use("/global", require("./globalRouter"));
module.exports = router;
