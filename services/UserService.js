const functions = require("../util/functions.js");

module.exports = {
  editUser: async (req, res) => {
    try {
      if (req.user.userData) {
        const userId = req.user.userData.id;
        const data = req.body.userData;
        console.log(console.log(req.user));
        if (!data) {
          return res.send({ success: false, error: "No payload data" });
        }
        if (typeof data !== "object") {
          return res.send({
            success: false,
            error: "User data must be a object",
          });
        }

        await functions.updateUserById(userId, { ...data });
        //Log user update
        res.send({ success: true, message: `User has been updated updated` });
      }
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  },

  getAllUsers: async (req, res) => {
    try {
      console.log("To-do: filter out sensitive user data");
      const users = await functions.getUsers();
      res.send({ success: true, data: users });
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await functions.getUserById(userId, false);
      if (!user) {
        return res.send({ success: false, error: "User not found" });
      } else {
        return res.send({ success: true, data: user });
      }
    } catch (e) {
      console.log(e);
    }
  },

  addFriend: async (req, res) => {
    try {
      const reqUser = await functions.getUserById(req.user.userData.id, false);
      const targetId = req.body.targetId;
      if (!targetId) {
        return res.send({ success: false, error: "No target id" });
      }
      const fetchedTarget = await functions.getUserById(targetId, false);
      console.log("To do filter sensitive data on addFriend");
      if (!fetchedTarget) {
        return res.send({ success: false, error: "User not found" });
      } else if (
        fetchedTarget.Frequests.filter(
          (elem) => elem.reqUser.id === reqUser.id
        )[0]
      ) {
        return res.send({
          success: false,
          error: "You already have an active request",
        });
      } else {
        await functions.updateUserById(fetchedTarget.id, {
          Frequests: [
            ...fetchedTarget.Frequests,
            { reqUser: { id: reqUser.id }, target: { id: fetchedTarget.id } },
          ],
        });
        const newUserData = {
          userName: reqUser.userName,
          tag: reqUser.tag,
          matches: reqUser.matches,
          friends: reqUser.friends,
          Frequests: [
            ...reqUser.Frequests,
            { reqUser: { id: reqUser.id }, target: { id: fetchedTarget.id } },
          ],
          id: reqUser.id,
          googleData: reqUser.googleData,
          email: reqUser.email,
          name: reqUser.name,
        };
        await functions.updateUserById(reqUser.id, newUserData);
        console.log(newUserData);
        return res.send({
          success: true,
          newUserData,
          message: "Request sent",
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
  cancelFriendRequest: async (req, res) => {
    try {
      const reqUserId = req.body.reqUserId;
      const targetId = req.body.targetId;
      if (!targetId || !reqUserId) {
        return res.send({ success: false, error: "No target id" });
      }
      const fetchedReqUser = await functions.getUserById(reqUserId, false);
      const fetchedTarget = await functions.getUserById(targetId, false);
      if (!fetchedTarget) {
        return res.send({ success: false, error: "Fetched user not found" });
      } else if (!fetchedReqUser) {
        return res.send({ success: false, error: "Request user not found" });
      }
      if (
        fetchedReqUser.Frequests.filter(
          (elem) => elem.target.id === fetchedTarget.id
        ).length >= 1
      ) {
        const newTargetData = {
          userName: fetchedTarget.userName,
          tag: fetchedTarget.tag,
          matches: fetchedTarget.matches,
          friends: [...fetchedTarget.friends],
          Frequests: fetchedTarget.Frequests.filter(
            (elem) => elem.reqUser.id !== fetchedReqUser.id
          ),
          id: fetchedTarget.id,
          googleData: fetchedTarget.googleData,
          email: fetchedTarget.email,
          name: fetchedTarget.name,
        };
        const newUserData = {
          userName: fetchedReqUser.userName,
          tag: fetchedReqUser.tag,
          matches: fetchedReqUser.matches,
          friends: [...fetchedReqUser.friends],
          Frequests: fetchedReqUser.Frequests.filter(
            (elem) => elem.target.id !== fetchedTarget.id
          ),
          id: fetchedReqUser.id,
          googleData: fetchedReqUser.googleData,
          email: fetchedReqUser.email,
          name: fetchedReqUser.name,
        };
        await functions.updateUserById(fetchedTarget.id, newTargetData);
        await functions.updateUserById(newUserData.id, newUserData);
        return res.send({
          success: true,
          newReqData: { ...newUserData },
          newTargetData: { ...newTargetData },
          message: "Request cancelled",
        });
      } else {
        return res.send({
          success: false,
          error: "Friend request does not exist",
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
  acceptFriendRequest: async (req, res) => {
    try {
      const reqId = req.user;
      console.log(reqId);
      const reqUserId = req.body.reqUserId;
      const targetId = req.body.targetId;
      if (!targetId || !reqUserId) {
        return res.send({ success: false, error: "No target id" });
      }
      const fetchedReqUser = await functions.getUserById(reqUserId, false);
      const fetchedTarget = await functions.getUserById(targetId, false);
      if (!fetchedTarget) {
        return res.send({ success: false, error: "Fetched user not found" });
      } else if (!fetchedReqUser) {
        return res.send({ success: false, error: "Request user not found" });
      }
      if (
        fetchedReqUser.Frequests.filter(
          (elem) => elem.target.id === fetchedTarget.id
        ).length >= 1
      ) {
        const newTargetData = {
          userName: fetchedTarget.userName,
          tag: fetchedTarget.tag,
          matches: fetchedTarget.matches,
          friends: [...fetchedTarget.friends, { id: fetchedReqUser.id }],
          Frequests: fetchedTarget.Frequests.filter(
            (elem) => elem.reqUser.id !== fetchedReqUser.id
          ),
          id: fetchedTarget.id,
          googleData: fetchedTarget.googleData,
          email: fetchedTarget.email,
          name: fetchedTarget.name,
        };
        const newUserData = {
          userName: fetchedReqUser.userName,
          tag: fetchedReqUser.tag,
          matches: fetchedReqUser.matches,
          friends: [...fetchedReqUser.friends, { id: fetchedTarget.id }],
          Frequests: fetchedReqUser.Frequests.filter(
            (elem) => elem.target.id !== fetchedTarget.id
          ),
          id: fetchedReqUser.id,
          googleData: fetchedReqUser.googleData,
          email: fetchedReqUser.email,
          name: fetchedReqUser.name,
        };
        await functions.updateUserById(fetchedTarget.id, newTargetData);
        await functions.updateUserById(newUserData.id, newUserData);
        return res.send({
          success: true,
          newReqData: { ...newUserData },
          newTargetData: { ...newTargetData },
          message: "Request accepted",
        });
      } else {
        return res.send({
          success: false,
          error: "Friend request does not exist",
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
