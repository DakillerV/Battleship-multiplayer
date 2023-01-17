const express = require("express");
const fs = require("fs");
const uniqid = require("uniqid");
const session = require("express-session");
cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const MongoDbStore = require("connect-mongodb-session")(session);
const rateLimit = require("./modules/rate-limiter");
const app = express();
const http = require("http");
const server = http.createServer(app);
const passport = require("./middlewares/passport");
const axios = require("axios");
const {
  addUser,
  removeUser,
  getUser,
  addGameUser,
  removeGameUser,
  getGameUser,
  getUsersInGame,
  getUsersInRoom,
  getUsersLookingForGame,
  addUserLookingForGame,
  editConnectedUser,
  editGameUser,
  removeUserLookingForGame,
  addConnectedUser,
  removeConnectedUser,
  getConnectedUser,
  getConnectedUsers,
} = require("./socketUtil");
const Logger = require("./util/Logger");
const ImageModel = require("./db/Image");
require("dotenv/config");
const router = require("./routes/router");
const Global = require("./schemas/Global");
const {
  addGlobal,
  idGenerator,
  addGame,
  removeGame,
  getGameById,
  updateGameById,
} = require("./util/functions");
const production = process.env.STATUS === "production";
const webSocketServer = require("websocket").server;
//db
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    Logger.log("Db", "Mongo Connected");
  });

//middleware
const store = new MongoDbStore({
  uri: `${process.env.MONGO_URI}`,
  collection: "sessions",
});

const getGlobals = async () => {
  const globals = await Global.find();

  return globals;
};
getGlobals().then((globals) => {
  const buildId = uniqid();
  if (globals.length === 0) {
    addGlobal(buildId);
  }
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,
    cookie: {
      expires: 1000 * 60 * 60 * 24,
    },
    name: "Session",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/api", router);

if (production) {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      require("path").resolve(__dirname, "client", "build", "index.html")
    );
  });
}
const port = production ? process.env.PROD_PORT : process.env.DEV_PORT;
server.listen(port, () => {
  Logger.dashboard("Boot", `Server is live on port ${port}`);
});

const io = require("socket.io")(server, {
  pingInterval: 5000,
});

const getWord = async () => {
  let response;
  try {
    await axios
      .get("https://api.api-ninjas.com/v1/randomword", {
        headers: {
          "X-Api-key": "Rz2izh6lDOd8SI4O17g+uA==L8JkXwt5Fw3UdfPm",
        },
      })
      .then((res) => {
        const resData = res.data;
        response = resData;
      });
  } catch (error) {
    console.log(error);
  }
  if (!response) {
    return { error: true };
  }

  return response;
};

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  let user;
  // io.to("103038783562848863161").emit("allUsersUpdate", getConnectedUsers());
  socket.on("setup", (userData) => {
    socket.join(userData.userData.id);
    user = userData;
    // editConnectedUser(socket.id, { userId: user.userData.id });
    addConnectedUser({
      userId: user.userData.id,
      id: socket.id,
    });
    io.to("103038783562848863161").emit("allUsersUpdate", getConnectedUsers());
    socket.emit("connected");
  });

  socket.on("ping", function () {
    socket.emit("pong");
  });

  socket.on("adminMessage", async (socketId, message, callback) => {
    if (user?.userData?.id === "103038783562848863161" && socketId) {
      try {
        io.to(socketId).emit("adminMessage", message);
        callback("Message Sent");
      } catch (e) {
        callback(e);
      }
    }
  });
  socket.on("joinGame", async ({ gameId }, callback) => {
    if (user) {
      const addedUser = addGameUser({
        id: socket.id,
        userId: user.userData.id,
        gameId,
      });
      const user2 = addedUser.user;
      const error = addedUser.error;
      if (error === "Already Connected") {
        socket.join(gameId);
        io.to(gameId).emit("liveGame", {
          gameId: gameId,
          users: getUsersInGame(gameId),
        });
      }
      if (error) {
        return callback(error);
      }
      if (user2) {
        socket.join(user2.gameId);
        io.to(user2.gameId).emit("liveGame", {
          gameId: user2.gameId,
          users: getUsersInGame(user2.gameId),
        });
      }
    }
  });

  socket.on("getConnectedUsers", (callback) => {
    if (user?.userData?.id === "103038783562848863161") {
      const users = getConnectedUsers();
      console.log(users);
      callback(users);
    }
  });

  socket.on("joinRoom", ({ roomId, userId }, callback) => {
    const { error, user } = addUser({ id: socket.id, userId, roomId });
    if (error) return callback(error);
    socket.join(user.roomId);
    io.to(user.roomId).emit("roomData", {
      room: user.roomId,
      users: getUsersInRoom(user.roomId),
    });
    console.log(`${userId} joined Room: ${roomId}`);
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.roomId).emit("message", {
      roomId: user.roomId,
      sender: user.userId,
      message,
      timeStamp: new Date(),
    });

    callback();
  });
  let findGameInterval;
  socket.on("findGame", async () => {
    if (user?.userData) {
      addUserLookingForGame({ userId: user.userData.id, id: socket.id });
      let usersLookingForGame;
      let count = 0;
      findGameInterval = setInterval(async () => {
        count += 1;
        if (count > 500) {
          clearInterval(findGameInterval);
        }
        usersLookingForGame = getUsersLookingForGame().filter(
          (elem) => elem.userId !== user.userData.id
        );
        console.log(`Available Users ${usersLookingForGame.length}`);
        console.log(usersLookingForGame);
        if (usersLookingForGame[0]?.userId) {
          const matchUp =
            usersLookingForGame[
              Math.floor(Math.random() * usersLookingForGame.length)
            ];
          removeUserLookingForGame(matchUp.id);
          removeUserLookingForGame(socket.id);
          const word = await getWord();
          const game = await addGame({
            word: word.word,
            players: [{ userId: matchUp.userId }, { userId: user.userData.id }],
          });
          io.to(user.userData.id).emit("gameUpdate", { id: game.id });
          io.to(matchUp.userId).emit("gameUpdate", { id: game.id });
          clearInterval(findGameInterval);
        }
      }, 5000);
    }
  });

  socket.on("editGameUser", async (data) => {
    if (user) {
      console.log(data);
      const user2 = getGameUser(socket.id);
      editGameUser(user2.userId, data);
      io.to(user2.gameId).emit("liveGame", {
        gameId: user2.gameId,
        users: getUsersInGame(user2.gameId),
      });
    }
  });

  socket.on("gameState", async (state) => {
    if (user) {
      if (state === "start") {
        const user2 = getGameUser(socket.id);
        await updateGameById(user2.gameId, {
          started: true,
          startedBy: user2.userId,
        });
        io.to(user2.gameId).emit("gameState", "start");
      } else if (state === "end") {
        const user2 = getGameUser(socket.id);
        io.to(user2.gameId).emit("gameState", "end");
      }
    }
  });
  socket.on("finishGame", async (callback) => {
    if (user) {
      const user2 = getGameUser(socket.id);
      const game = await getGameById(user2.gameId);
      console.log(game)
      if (
        !game.players.filter((elem) => elem.userId === user2.userId)[0].finished
      ) {
        let arr = [...game.players];
        const index = arr.findIndex((elem) => elem.userId === user2.userId);
        arr[index] = { ...arr[index], finished: true, stats: {} };
        console.log(arr);
      } else {
        callback("Game already finished");
      }
      updateGameById(user2.gameId, {});
    }
  });

  socket.on("getGame", async ({ id }) => {
    if (user) {
      const game = await getGameById(id);
      let isPlayer = false;

      if (!game) {
        return io
          .to(user.userData.id)
          .emit("gameData", { error: "Game not found" });
      }
      game.players.map((elem) => {
        if (elem.userId === user.userData.id) {
          isPlayer = true;
        }
      });
      if (isPlayer) {
        io.to(user.userData.id).emit("gameData", { ...game });
      }
    }
  });

  socket.on("stopSearch", () => {
    if (user?.userData && findGameInterval !== null) {
      clearInterval(findGameInterval);
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    const gameUser = removeGameUser(socket.id);
    const connectedUser = removeConnectedUser(socket.id);
    if (gameUser) {
      io.to(gameUser.gameId).emit("liveGame", {
        gameId: gameUser.gameId,
        users: getUsersInGame(gameUser.gameId),
      });
    }
    if (user) {
      io.to(user.room).emit("roomData", {
        room: user.roomId,
        users: getUsersInRoom(user.roomId),
      });
    }
  });
});
