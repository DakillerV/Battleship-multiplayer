import { useContext, useEffect } from "react";
import { Group, Image, Layer, Rect, Stage, Text } from "react-konva";
import { MainContext } from "../../contexts/main";
import HangMan from "./components/hangman";
import useKonvaImage from "react-konva-image";
import HangmanImage from "../../assets/imgs/hangman.png";
import GameOver from "./pages/GameOver";
import { toast } from "react-hot-toast";
import Stopped from "./pages/Stopped";
import GameComp from "./pages/Game";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
const Game = () => {
  const navigate = useNavigate();
  const [img1] = useKonvaImage(HangmanImage);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    windowSize,
    game,
    setGame,
    socket,
    savedGame,
    setSavedGame,
    userData,
  } = useContext(MainContext);

  useEffect(() => {
    console.log("State change");
    if (game.strikes >= 6 && game.status !== "ended") {
      setGame((prev) => ({ ...prev, status: "ended", won: false }));
      socket.emit("finishGame", (msg) => {
        toast.success(msg)
      })
    }
  }, [game]);

  useEffect(() => {
    if (
      window.location.href.includes("game") &&
      searchParams.get("id") !== null
    ) {
      const gameId = searchParams.get("id");
      socket.emit("getGame", { id: gameId });
      socket.emit(
        "joinGame",
        { gameId: gameId, userId: userData.id },
        () => {}
      );
    } else {
      navigate("/");
    }
    socket.on("gameData", (savedGame) => {
      if (savedGame.error) {
        navigate("/");
      }
      setSavedGame(savedGame);
    });
    socket.on("liveGame", (liveGame) => {
      console.log(liveGame);
      setGame((prev) => ({
        ...prev,
        players: liveGame.users.map((elem) => ({
          ...elem,
          userId: elem.userId,
          connected: true,
        })),
      }));
    });
  }, []);

  useEffect(() => {
    socket.on("gameState", (state) => {
      if (state === "start") {
        return startGame();
      } else if (state === "end") {
        return resetGame();
      }
    });
  }, [savedGame]);
  const resetPointer = (e) => {
    const container = e.target.getStage().container();
    container.style.cursor = "default";
  };
  const resetGame = () => {
    setGame({
      status: "stopped",
      word: null,
      strikes: 0,
    });
  };
  const startGame = async () => {
    if (savedGame) {
      if (game.status !== "running") {
        const word = savedGame.word;
        if (word) {
          toast.success("Game started");
          setGame({ word: word, status: "running", strikes: 0 });
        } else {
          toast.error("Failed to start game");
          console.log("Failed to start game");
        }
      }
    }
  };

  return (
    savedGame && (
      <Stage width={windowSize.innerWidth} height={windowSize.innerHeight}>
        {game.status === "running" ? (
          <GameComp
            resetGame={resetGame}
            startGame={startGame}
            resetPointer={resetPointer}
          ></GameComp>
        ) : game.status === "stopped" ? (
          <Stopped
            resetGame={resetGame}
            startGame={startGame}
            resetPointer={resetPointer}
          ></Stopped>
        ) : (
          game.status === "ended" && (
            <GameOver
              resetGame={resetGame}
              startGame={startGame}
              resetPointer={resetPointer}
            />
          )
        )}
      </Stage>
    )
  );
};

export default Game;
