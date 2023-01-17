const User = require("../schemas/User");
const Global = require("../schemas/Global");
const Room = require("../schemas/Room");
const Game = require("../schemas/Game");

function formatNumber(n) {
  return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

/**
 * @param {string} str
 * @returns {string}
 */
const toCapitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Add a user to the database
 * @param {string} userId
 * @param {string} guildId
 */
async function getRooms() {
  try {
    const rooms = await Room.find().lean();
    return [...rooms];
  } catch (e) {
    console.error(e);
  }
}

async function getUsersRooms(userId) {
  try {
    const rooms = await Room.find().lean();
    console.log(
      rooms.filter(
        (elem) => elem.members.filter((elem) => elem.id === userId).length !== 0
      )
    );
    const returnedRooms = rooms.filter(
      (elem) => elem.members.filter((elem) => elem.id === userId).length !== 0
    );
    return [...returnedRooms];
  } catch (e) {
    console.error(e);
  }
}

async function addRoom(data) {
  try {
    const randomId = idGenerator();
    const room = new Room({ id: randomId, ...data });

    await room.save();

    return room;
  } catch (e) {
    console.error(e);
  }
}

async function removeRoom(roomId) {
  try {
    await Room.findOneAndDelete({ id: roomId });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: e };
  }
}

async function getRoomById(roomId) {
  try {
    let room = await Room.findOne({ id: roomId });

    if (!room) {
      return undefined;
    }
    return {
      ...room._doc,
    };
  } catch (e) {
    console.error(e);
  }
}

async function updateRoomById(roomId, data) {
  try {
    if (typeof data !== "object") {
      throw Error("'data' must be an object");
    }

    const user = await getRoomById(roomId);

    if (!user) {
      await addRoom(data);
    }

    await Room.findOneAndUpdate({ id: roomId }, data);
  } catch (e) {
    console.error(e);
  }
}

/////
async function addGame(data) {
  try {
    const randomId = idGenerator();
    const game = new Game({ id: randomId, ...data });

    await game.save();

    return game;
  } catch (e) {
    console.error(e);
  }
}

async function removeGame(gameId) {
  try {
    await Game.findOneAndDelete({ id: gameId });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: e };
  }
}

async function getGameById(gameId) {
  try {
    let game = await Game.findOne({ id: gameId });

    if (!game) {
      return undefined;
    }
    return {
      ...game._doc,
    };
  } catch (e) {
    console.error(e);
  }
}

async function updateGameById(gameId, data) {
  try {
    if (typeof data !== "object") {
      throw Error("'data' must be an object");
    }

    const game = await getGameById(gameId);

    if (!game) {
      await addGame(data);
    }

    await Game.findOneAndUpdate({ id: gameId }, data);
  } catch (e) {
    console.error(e);
  }
}
////
function idGenerator() {
  return (performance.now().toString(36) + Math.random().toString(36)).replace(
    /\./g,
    ""
  );
}

/**
 * Add a user to the database
 * @param {string} userId
 */
async function addUser(userId, data) {
  try {
    const user = new User({ id: userId, ...data });

    await user.save();

    return user;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Add a user to the database
 * @param {string} buildId
 */
async function addGlobal(buildId) {
  try {
    const global = new Global({ buildId });

    await global.save();

    return global;
  } catch (e) {
    console.error(e);
  }
}

/**
 *
 * @param {string} buildId
 */
async function getGlobal(buildId, createdIfNotFound) {
  if (createdIfNotFound === undefined) {
    createdIfNotFound = true;
  }
  try {
    let global = await Global.findOne({ buildId });

    if (!global && createdIfNotFound) {
      global = await addGlobal(buildId);
    }

    return {
      ...global,
    };
  } catch (e) {
    console.error(e);
  }
}
/**
 * Updates user information
 * @param {string} buildId Id of the user
 * @param {object} data updated data object
 */
async function updateGlobal(buildId, data) {
  try {
    if (!data) {
      throw Error("missing data params");
    }
    if (typeof data !== "object") {
      throw Error("'data' must be an object");
    }

    const global = await getGlobal(buildId);

    if (!global) {
      await addGlobal(buildId);
    }

    await Global.findOneAndUpdate({ buildId }, data);
  } catch (e) {
    console.error(e);
  }
}

async function getUsers() {
  try {
    const users = await User.find().lean();
    return [...users];
  } catch (e) {
    console.error(e);
  }
}

/**
 *
 * @param {string} userId
 * @param {boolean} createdIfNotFound
 */
async function getUserById(id, createdIfNotFound) {
  if (createdIfNotFound === undefined) {
    createdIfNotFound = true;
  }
  try {
    let user = await User.findOne({ id });

    if (!user && createdIfNotFound !== false) {
      console.log("Adding User Because of getUserById");
      user = await addUser(id);
    }

    return user;
  } catch (e) {
    console.error(e);
  }
}
/**
 * Updates user information
 * @param {string} userId Id of the user
 * @param {object} data updated data object
 */
async function updateUserById(userId, data) {
  try {
    if (!data) {
      throw Error("missing data params");
    }
    if (typeof data !== "object") {
      throw Error("'data' must be an object");
    }
    const user = await getUserById(userId, false);
    if (!user) {
      console.log("Trying to make user");
      // await addUser(userId);
    }

    await User.findOneAndUpdate({ id: userId }, data);
  } catch (e) {
    console.error(e);
  }
}
/**
 *
 * @param {string} userId
 * @param {string} guildId
 */
async function removeUser(userId, guildId) {
  try {
    await User.findOneAndDelete({ userID: userId, guildID: guildId });
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  formatNumber,
  addRoom,
  addGlobal,
  getGlobal,
  updateGlobal,
  removeRoom,
  updateRoomById,
  removeUser,
  idGenerator,
  getUsers,
  getUsersRooms,
  addUser,
  getRooms,
  getUserById,
  getRoomById,
  updateUserById,
  addGame,
  removeGame,
  getGameById,
  updateGameById,
  toCapitalize,
};
