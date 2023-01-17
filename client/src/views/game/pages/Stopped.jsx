import { useContext, useEffect, useRef } from "react";
import { Group, Image, Layer, Rect, Stage, Text } from "react-konva";
import { MainContext } from "@contexts/main";
import useKonvaImage from "react-konva-image";
import HangmanImage from "../../../assets/imgs/hangman.png";
import startImg from "../../../assets/imgs/btns/start.png";
import Konva from "konva";
import { all } from "axios";
const Stopped = ({ resetGame, startGame, resetPointer }) => {
  const ref = useRef(null);
  const [img1] = useKonvaImage(HangmanImage);
  const [img2] = useKonvaImage(startImg);
  const {
    windowSize,
    game,
    setGame,
    savedGame,
    setSavedGame,
    socket,
    userData,
    getUserFromCache,
  } = useContext(MainContext);
  const userdata = userData.userData;
  let count = 220;
  const user2 = game.players.filter((elem) => elem.userId === userdata.id)[0];
  const readyToggle = () => {
    socket.emit("editGameUser", {
      ready: !user2.ready,
    });
  };

  let allPlayersConnected;
  let allPlayersReady;

  allPlayersConnected =
    game.players.filter((elem) => elem.connected === true).length ===
    savedGame.players.length;

  allPlayersReady =
    game.players.filter((elem) => elem.ready === true).length ===
    savedGame.players.length;

  useEffect(() => {
    allPlayersConnected =
      game.players.filter((elem) => elem.connected === true).length ===
      savedGame.players.length;
    allPlayersReady =
      game.players.filter((elem) => elem.ready === true).length ===
      savedGame.players.length;
  }, [game]);
  useEffect(() => {
    if (!allPlayersConnected || !allPlayersReady) {
      ref.current.cache();
      ref.current.filters([Konva.Filters.Grayscale]);
      return;
    } else {
    }
    ref.current.cache();
    ref.current.filters([Konva.Filters.Brighten]);
  }, [game]);
  
  const startGameForAll = () => {
    socket.emit("gameState", "start")
  }
  return (
    <Layer>
      <Rect
        fill="#2B2D42"
        width={windowSize.innerWidth}
        height={windowSize.innerHeight}
        x={0}
        y={0}
      ></Rect>

      <Text
        text="Hangman"
        x={150}
        fontSize={60}
        y={140}
        width={1000}
        height={100}
        fill="white"
      ></Text>
      <Text
        text="Waiting for players"
        x={155}
        fontSize={30}
        y={200}
        width={1000}
        height={100}
        fill="white"
      ></Text>
      {savedGame.players.map((elem, key) => {
        count += 30;

        const user = getUserFromCache(elem.userId);
        return (
          <Group key={key}>
            <Text
              text={`${key + 1}. ${user.userName || user.googleData.displayName}
            `}
              x={155}
              fontSize={30}
              y={count}
              width={1000}
              height={100}
              fill="white"
            ></Text>
            <Text
              text={`${
                game.players
                  .filter((elem2) => elem2.connected === true)
                  .filter((elem2) => elem2.userId === elem.userId)[0]
                  ? "Connected"
                  : ""
              }
            `}
              x={400}
              fontSize={30}
              y={count}
              width={1000}
              height={100}
              fill="green"
            ></Text>
            <Text
              text={`
            ${
              game.players
                .filter((elem2) => elem2.ready === true)
                .filter((elem2) => elem2.userId === elem.userId)[0]
                ? "Ready"
                : ""
            }
            `}
              x={500}
              fontSize={30}
              y={count - 30}
              width={1000}
              height={100}
              fill="green"
            ></Text>
          </Group>
        );
      })}
      <Text
        text={`${user2?.ready ? "Unready" : "Ready"}`}
        x={155}
        fontSize={30}
        y={450}
        width={1000}
        height={100}
        fill="white"
        onClick={() => {
          readyToggle();
        }}
      ></Text>
      <Image image={img1} width={500} height={500} x={700}></Image>
      <Image
        image={img2}
        width={250}
        height={250}
        y={500}
        x={100}
        ref={ref}
        onMouseEnter={(e) => {
          if (allPlayersConnected && allPlayersReady) {
            const container = e.target.getStage().container();
            container.style.cursor = "pointer";
            e.target.scaleX(1.2);
            e.target.scaleY(1.2);
          }
        }}
        onMouseLeave={(e) => {
          if (allPlayersConnected && allPlayersReady) {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
            e.target.scaleX(1);
            e.target.scaleY(1);
          }
        }}
        onClick={(e) => {
          if (allPlayersConnected && allPlayersReady) {
            resetPointer(e);
            startGameForAll()
          }
        }}
      ></Image>
    </Layer>
  );
};

export default Stopped;
