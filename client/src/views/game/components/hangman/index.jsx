import { useContext } from "react";
import { Group, Image, Layer, Text } from "react-konva"
import useKonvaImage from 'react-konva-image';
import hangman1 from "../../../../assets/imgs/hangman/1.png"
import hangman2 from "../../../../assets/imgs/hangman/2.png"
import hangman3 from "../../../../assets/imgs/hangman/3.png"
import hangman4 from "../../../../assets/imgs/hangman/4.png"
import hangman5 from "../../../../assets/imgs/hangman/5.png"
import hangman6 from "../../../../assets/imgs/hangman/6.png"
import { MainContext } from "@contexts/main";
const HangMan = () => {
    const { game, setGame } = useContext(MainContext);
    const [img1] = useKonvaImage(hangman1)
    const [img2] = useKonvaImage(hangman2)
    const [img3] = useKonvaImage(hangman3)
    const [img4] = useKonvaImage(hangman4)
    const [img5] = useKonvaImage(hangman5)
    const [img6] = useKonvaImage(hangman6)


    return (
        <Group>
            {game.strikes >= 1 && (
                <Image image={img1} x={0} y={0}></Image>
            )}
            {game.strikes >= 2 && (
                <Image image={img2} x={0} y={0}></Image>
            )}
            {game.strikes >= 3 && (
                <Image image={img3} x={0} y={0}></Image>
            )}
            {game.strikes >= 4 && (
                <Image image={img4} x={0} y={0}></Image>
            )}
            {game.strikes >= 5 && (
                <Image image={img5} x={0} y={0}></Image>
            )}
            {game.strikes >= 6 && (
                <Image image={img6} x={0} y={0}></Image>
            )}
        </Group>
    )
}

export default HangMan