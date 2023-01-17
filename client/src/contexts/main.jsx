import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getUserData } from "../utility/Utils";
import axios from "axios";
import toast from "react-hot-toast";
import qs from "qs";
import Spinner from "@components/loader/Spinner";
export const MainContext = React.createContext({});
const MainProvider = ({ children, socket, startingUserData }) => {
  const firstUpdate = useRef(true);
  const [savedGame, setSavedGame] = useState(null);
  const [userData, setUserData] = useState(startingUserData);
  const [userCache, setUserCache] = useState(null);
  const [gameLoading, setGameLoading] = useState({
    loadingScreen: false,
    message: "",
    elapsedTime: null,
  });
  const [game, setGame] = useState({
    players: [],
    status: "stopped",
    word: null,
    strikes: 0,
  });
  const [miniChatOpen, setMiniChatOpen] = useState(false);
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());

  const setLookingForGame = (bool) => {
    if (bool) {
      setGameLoading({
        loadingScreen: true,
        message: `Looking for a game, Please wait`,
        elapsedTime: new Date(),
      });
      setGame((prev) => ({ ...prev, lookingForGame: true }));
    } else {
      setGameLoading({
        loadingScreen: false,
        message: ``,
        elapsedTime: null,
      });
      setGame((prev) => ({ ...prev, lookingForGame: false }));
    }
  };
  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/user/getallusers/",
    }).then((res) => {
      const resData = res.data;
      if (resData.success) {
        setUserCache(resData.data);
      } else {
        console.log("Failed to fetch userCache");
      }
    });
    axios({
      method: "GET",
      url: "/api/auth/current-session/",
    }).then((res) => {
      const resData = res.data;
      if (resData.login) {
        setUserData(resData.userData);
      } else {
        console.log("Failed to fetch user");
      }
    });
  }, []);
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    console.log(game);
    if (game.lookingForGame) {
      console.log("imiting");
      socket.emit("findGame", { id: userData.id });
    }
    if (game.lookingForGame === false) {
      let newObj = { ...game };
      socket.emit("stopSearch");
      delete newObj.lookingForGame;
      setGame(newObj);
    }
  }, [game]);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      socket.on("adminMessage", (message) => {
        console.log(message);
        toast.success(message);
      });
      socket.on("gameUpdate", (savedGame) => {
        toast.success(`Opponent found and Game made. GameId: ${savedGame.id}`);
        socket.emit("stopSearch");
        window.location.href = `/game?id=${savedGame.id}`;
        setLookingForGame(false);
      });
      firstUpdate.current = false;
      return;
    }
  }, []);
  const getUserFromCache = (id) => {
    const index = userCache.findIndex((elem) => elem.id === id);
    return userCache[index];
  };
  return userCache ? (
    <MainContext.Provider
      value={{
        socket,
        gameLoading,
        setGameLoading,
        getUserFromCache,
        windowSize,
        userCache,
        userData,
        setUserData,
        miniChatOpen,
        setMiniChatOpen,
        game,
        setGame,
        setLookingForGame,
        savedGame,
        setSavedGame,
      }}
    >
      {children}
    </MainContext.Provider>
  ) : (
    <Spinner></Spinner>
  );
};

export default MainProvider;
