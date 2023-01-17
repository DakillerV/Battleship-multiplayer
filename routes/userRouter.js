var router = require("express").Router();
const {
  editUser,
  getAllUsers,
  addFriend,
  getUserById,
  cancelFriendRequest,
  acceptFriendRequest,
  getMessages
} = require("../services/UserService");

router.route("/edit").put(editUser);
router.route("/getallusers").get(getAllUsers);
router.route("/addfriend").put(addFriend);
router.route("/acceptreq").put(acceptFriendRequest);
router.route("/cancelreq").put(cancelFriendRequest);
router.route("/:userId").get(getUserById);
// router.route("/user/:userId/forms").get(getAllFormsOfUser)

module.exports = router;
