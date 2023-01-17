import { useContext, useEffect, useState } from "react";
import { Group, Image, Layer, Rect, Stage, Text } from "react-konva";
import { MainContext } from "@contexts/main";
import useKonvaImage from "react-konva-image";
import HangmanImage from "../../../assets/imgs/hangman.png";
import startImg from "../../../assets/imgs/btns/start.png";
import HangMan from ".././components/hangman";
import { whiteListedKeys } from "@utils";
import toast from "react-hot-toast";
const GameComp = ({ resetGame, startGame }) => {
  const [img1] = useKonvaImage(HangmanImage);
  const [img2] = useKonvaImage(startImg);
  const [timer, setTimer] = useState("60:00");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [timerColor, setTimerColor] = useState("white");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const { windowSize, game, setGame } = useContext(MainContext);
  const maxTime = 60000;
  const deadline = Date.now() + maxTime;
  const getTime = () => {
    const time = deadline - Date.now();
    let iso;
    if (time > 60000) {
      iso = new Date(time).toISOString().slice(14, 23);
    } else {
      iso = new Date(time).toISOString().slice(17, 23);
    }
    if (maxTime / 2 > time) {
      setTimerColor("orange");
    }
    if (maxTime / 4 > time) {
      setTimerColor("red");
    }

    setTimer(iso);
  };
  useEffect(() => {
    console.log(game)
    let correctLetters = []
    let arr = [...Array(game.word.length).keys()]
    arr.map((elem, key) => {
      let letter = game.word.charAt(key).toLowerCase();
      if (guessedLetters.includes(letter)) {
        correctLetters.push(letter)
        return
      } else return null
    })
    if (correctLetters.length === game.word.length) {
      setGame((prev) => ({ ...prev, status: "ended", won: true }))
    }
  }, [game, guessedLetters]);
  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 100);

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const trueTime = +timer.slice(0, 4)
    if (trueTime === 0) {
      setGame((prev) => ({ ...prev, status: "ended", won: false }))
    }
    
  }, [timer])
  const guessLetter = () => {
    if (!game.word.includes(selectedLetter)) {
        setGame((prev) => ({...prev, strikes: prev.strikes + 1}))
    }
    setGuessedLetters((prev) => [...prev, selectedLetter]);
    setSelectedLetter(null);
  };
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (whiteListedKeys.includes(key) && key !== "enter" && !guessedLetters.includes(key)) {
        return setSelectedLetter(key);
      }
      if (selectedLetter) {
        if (key === "enter") {
          return guessLetter();
        }
      }
    });
  }, [selectedLetter]);
  let count = 150;
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
        text={timer}
        fontSize={40}
        x={windowSize.innerWidth / 2 - 50}
        y={50}
        width={800}
        height={50}
        fill={timerColor}
      ></Text>
      {[...Array(game.word.length).keys()].map((elem, key) => {
        count += 60;

        let overideCount = count;
        let letter = game.word.charAt(key);
        if (!key) {
          letter = game.word.charAt(key).toUpperCase();
        }
        if (game.word.charAt(key) === "i" || game.word.charAt(key) === "l") {
          overideCount += 10;
        }
        if (guessedLetters.includes(letter.toLowerCase())) {
          return (
            <Group key={key}>
              <Text
                text={letter}
                fontSize={70}
                x={overideCount}
                y={140}
                width={100}
                height={50}
                fill="white"
              ></Text>
              <Rect x={count} y={215} width={50} height={5} fill="white"></Rect>
            </Group>
          );
        }
        return (
          <Group key={key}>
            <Rect x={count} y={215} width={50} height={5} fill="white"></Rect>
          </Group>
        );
      })}
      <HangMan></HangMan>
      {selectedLetter ? (
        <>
          <Text
            text="Selected letter"
            x={windowSize.innerWidth / 2 - 60}
            y={500}
            width={500}
            height={500}
            fontSize={25}
            fill={"white"}
          ></Text>
          <Text
            text={selectedLetter}
            x={windowSize.innerWidth / 2 + 10}
            y={550}
            width={500}
            height={500}
            fontSize={40}
            fill={"white"}
          ></Text>
          <Group
            onClick={() => {
              guessLetter();
            }}
          >
            <Rect
              x={windowSize.innerWidth / 2 - 60}
              y={600}
              width={165}
              height={50}
              fontSize={40}
              fill={"white"}
            ></Rect>
            <Text
              text={"Guess"}
              x={windowSize.innerWidth / 2 - 15}
              y={610}
              width={500}
              height={500}
              fontSize={25}
              fill={"black"}
            ></Text>
          </Group>
        </>
      ) : (
        <Text
          text="Select letter"
          x={windowSize.innerWidth / 2 - 60}
          y={500}
          width={500}
          height={500}
          fontSize={25}
          fill={"white"}
        ></Text>
      )}
    </Layer>
  );
};

export default GameComp;
