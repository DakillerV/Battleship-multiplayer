const functions = require("../util/functions.js");

module.exports = {
  roomsGet: async (req, res) => {
    try {
      const rooms = await functions.getRooms();
      res.send({ success: true, data: rooms });
    } catch (e) {
      res.send({ success: false, error: e });
    }
  },

  createMessage: async (req, res) => {
    try {
      console.log(req.body);
      const reqUser = req.user.userData;
      const roomId = req.body.roomId;
      const room = await functions.getRoomById(roomId);
      if (!room) {
        res.send({
          success: false,
          error: `Room not found`,
        });
      }
      if (!room.members.filter((elem) => elem.id === reqUser.id)[0]) {
        res.send({
          success: false,
          error: `You don't have permission to send this`,
        });
      }
      const data = {
        id: functions.idGenerator(),
        message: req.body.message,
        timeStamp: req.body.timeStamp,
        sender: reqUser.id,
      };
      await functions.updateRoomById(room.id, {
        messages: [...room.messages, data],
      });
      res.send({
        success: true,
        message: `Message ${data.id} Sent`,
        messageData: data,
        roomData: { ...room, messages: [...room.messages, data] },
      });
    } catch (error) {
      console.log(error);
      res.send({ success: false, error });
    }
  },
  createRoom: async (req, res) => {
    try {
      console.log(req.body);
      const reqUser = req.user.userData;
      const { type } = req.body;
      const data = {
        type: req.body.type,
        members: req.body.members,
        ownerId: req.body.ownerId,
        initiator: reqUser.id,
      };
      if (!data.type) {
        return res.send({ success: false, error: "Missing Required Arg" });
      }
      if (!data.ownerId && data.type !== "direct") {
        return res.send({ success: false, error: "Missing Required Arg2" });
      }
      //verify user is logged in and put userId in data
      const createdRoom = await functions.addRoom(data);
      res.send({
        success: true,
        message: `Room ${createdRoom.id} Created`,
        roomId: createdRoom.id,
      });
    } catch (error) {
      console.log(error);
      res.send({ success: false, error });
    }
  },

  getRoomById: async (req, res) => {
    try {
      const roomId = req.params.roomId;

      const room = await functions.getRoomById(roomId);
      const userData = req?.user?.userData;
      // if (room) {
      //   if (req.isAuthenticated()) {
      //     if (userData?.id !== form?.ownerId) {
      //       delete form.createdAt;
      //       delete form.updatedAt;
      //       delete form.docName;
      //       delete form.defaults;
      //     }
      //   } else {
      //     delete form.createdAt;
      //     delete form.updatedAt;
      //     delete form.docName;
      //     delete form.defaults;
      //   }
      // }
      if (!room) {
        return res.send({ success: false, error: "Room not found" });
      } else {
        return res.send({ success: true, data: room });
      }
    } catch (error) {}
  },

  deleteRoom: async (req, res) => {
    try {
      const roomId = req.params.roomId;

      const room = await functions.getRoomById(roomId);
      //use jwt session to verify u are the owner
      if (!room) {
        return res.send({ success: false, error: "Room not found" });
      }
      await functions.removeRoom(roomId);
      return res.send({
        success: true,
        message: `Room Id: ${roomId} has been deleted`,
      });
    } catch (error) {
      return res.send({ success: false, error });
    }
  },

  editRoom: async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const data = req.body.roomData;
      if (!data) {
        return res.send({ success: false, error: "No payload data" });
      }
      if (typeof data !== "object") {
        return res.send({
          success: false,
          error: "Room data must be a object",
        });
      }

      await functions.updateRoomById(roomId, { ...data });
      //Log room update
      res.send({ success: true, message: `Room: ${roomId} updated` });
    } catch (error) {
      res.send(error);
    }
  },

  getAllRoomsOfUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.send({ success: false, error: "No user id provided" });
      }
      const userRooms = await functions.getUsersRooms(userId);
      return res.send({ success: true, data: userRooms });
    } catch (error) {
      res.send({ success: false, error });
    }
  },
};
