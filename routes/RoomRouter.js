var router = require("express").Router();
const {
  createRoom,
  roomsGet,
  createMessage,
  deleteRoom,
  editRoom,
  getAllRoomsOfUser,
  getRoomById,
} = require("../services/RoomService");

router.route("/create").post(createRoom);
router.route("/message").post(createMessage);
router.route("/:roomId").get(getRoomById);
router.route("/:roomId/edit").put(editRoom);
router.route("/delete/:formId").delete(deleteRoom);
router.route("/user/:userId/rooms").get(getAllRoomsOfUser);

module.exports = router;
