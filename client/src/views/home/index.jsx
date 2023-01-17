import Hangman from "../../assets/imgs/hangman.png";
import Button from "react-bootstrap/Button";
import { useContext, useState } from "react";
import { MainContext } from "@contexts/main";
const Home = (props) => {
  const { gameLoading, setLookingForGame } = useContext(MainContext);
  return (
    <>
      <div className="center">
        <h2>Online multiplayer Hangman!!!</h2>
        <img src={Hangman} style={{ width: "350px" }}></img>
        <div style={{ margin: "auto", width: "50%" }}>
          <Button
            variant="dark"
            onClick={() => {
              setLookingForGame(true)
            }}
          >
            Find game
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
