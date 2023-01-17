const connectedUsers = [];
const users = [];
const usersLookingForGame = [];
const gameUsers = [];

const addConnectedUser = ({ userId, id }) => {
  const existingUser = connectedUsers.find(
    (user) => user.id === id
  );

  if (!userId || !id) return { error: "id and UserId are required." };
  if (existingUser) return { error: "Already Connected" };

  const user = { userId, id };

  connectedUsers.push(user);
  return { user };
};

const removeConnectedUser = (id) => {
  const index = connectedUsers.findIndex((user) => user.id === id);

  if (index !== -1) return connectedUsers.splice(index, 1)[0];
};

const getConnectedUser = (id) => connectedUsers.find((user) => user.id === id);

const getConnectedUsers = () => {
  return connectedUsers;
};

const getUsersLookingForGame = () => {
  return usersLookingForGame;
};

const editConnectedUser = (id, data) => {
    const index = connectedUsers.findIndex((user) => user.id === id);
    connectedUsers[index] = { ...connectedUsers[index], ...data };
  };
const addUserLookingForGame = ({ userId, id }) => {
  const existingUser = users.find(
    (user) => user.userId === userId && user.id === id
  );

  if (!userId || !id)
    return { error: "Socket Id (as id) and UserId (userId)are required" };
  if (existingUser) return { error: "Already Looking for game" };

  const user = { userId, id };

  usersLookingForGame.push(user);
  return { user };
};

const removeUserLookingForGame = (id) => {
  const index = usersLookingForGame.findIndex((user) => user.id === id);

  if (index !== -1) return usersLookingForGame.splice(index, 1)[0];
};

const addGameUser = ({ userId, gameId, id }) => {
  console.log(gameUsers);
  const existingUser = gameUsers.find(
    (user) => user.gameId === gameId && user.userId === userId
  );

  if (!userId || !gameId || !id)
    return { error: "id and gameId are required." };
  if (existingUser) return { error: "Already Connected" };

  const user = { userId, gameId, id };

  gameUsers.push(user);
  return { user };
};

const editGameUser = (userId, data) => {
  const index = gameUsers.findIndex((user) => user.userId === userId);
  gameUsers[index] = { ...gameUsers[index], ...data };
};

const removeGameUser = (id) => {
  const index = gameUsers.findIndex((user) => user.id === id);

  if (index !== -1) return gameUsers.splice(index, 1)[0];
};

const getGameUser = (id) => gameUsers.find((user) => user.id === id);

const getUsersInGame = (gameId) =>
  gameUsers.filter((user) => user.gameId === gameId);

const addUser = ({ userId, roomId, id }) => {
  const existingUser = users.find(
    (user) => user.roomId === roomId && user.userId === userId
  );

  if (!userId || !roomId || !id)
    return { error: "id and roomId are required." };
  if (existingUser) return { error: "Already Connected" };

  const user = { userId, roomId, id };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomId) =>
  users.filter((user) => user.roomId === roomId);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  removeUserLookingForGame,
  addConnectedUser,
  removeConnectedUser,
  getConnectedUser,
  getConnectedUsers,
  editGameUser,
  addGameUser,
  editConnectedUser,
  removeGameUser,
  getGameUser,
  getUsersInGame,
  getUsersLookingForGame,
  addUserLookingForGame,
};
