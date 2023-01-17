import { useContext, useEffect } from "react";
import { Group, Image, Layer, Rect, Stage, Text } from "react-konva";
import { MainContext } from "@contexts/main";
import useKonvaImage from "react-konva-image";
import HangmanImage from "../../../assets/imgs/hangman.png";
import PlayAgainImg from "../../../assets/imgs/btns/playAgain.png";
const GameOver = ({ resetGame, resetPointer }) => {
  const [img1] = useKonvaImage(HangmanImage);
  const [img2] = useKonvaImage(PlayAgainImg);
  const { windowSize, game, setGame } = useContext(MainContext);
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
        text="Game Over"
        x={150}
        fontSize={60}
        y={140}
        width={1000}
        height={100}
        fill="white"
      ></Text>
      {game?.won ? (
        <Text
          text="U WON!"
          x={155}
          fontSize={30}
          y={200}
          width={1000}
          height={100}
          fill="white"
        ></Text>
      ) : (
        <Text
          text="Ur dead"
          x={155}
          fontSize={30}
          y={200}
          width={1000}
          height={100}
          fill="white"
        ></Text>
      )}
      <Image image={img1} width={500} height={500} x={700}></Image>
      <Image
        image={img2}
        width={250}
        height={250}
        y={500}
        x={100}
        onMouseEnter={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = "pointer";
          e.target.scaleX(1.2);
          e.target.scaleY(1.2);
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = "default";
          e.target.scaleX(1);
          e.target.scaleY(1);
        }}
        onClick={(e) => {
          resetPointer(e);
          resetGame();
        }}
      ></Image>
    </Layer>
  );
};

export default GameOver;
