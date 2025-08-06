import pusherJs from "pusher-js";
import { useEffect, useState } from "react";
import styles from "../src/styles/Game.module.css";
import Submarine from "./Submarine";
import PlayBoard from "./PlayBoard";

type gameProps = {
    gameName: string;
    token: string;
};

const pusher = new pusherJs("1efb5cc2be2496875fb4", {
    cluster: "eu",
    channelAuthorization: { transport: "ajax", endpoint: "http://localhost:3000/pusher/auth" },
});

const initialSubmarines = [
    { posX: 30, posY: 20, size: 2, index: 0, horizontal: false },
    { posX: 660, posY: 40, size: 3, index: 1, horizontal: true },
];

export default function Game({ gameName, token }: gameProps) {
    const [submarines, setSubmarines] = useState(initialSubmarines);
    const [subDragInfos, setSubDragInfos] = useState({
        horizontal: true,
        pos: -1,
        size: -1,
        index: -1,
        shiftX: -1,
        shiftY: -1,
    });
    const [isGameStart, setIsGameStart] = useState(false);

    useEffect(() => {
        const channel = pusher.subscribe("presence-cache-" + gameName);
        channel.bind("maps", bind);
        return () => {
            pusher.unsubscribe("presence-cache-" + gameName);
            channel.unbind("maps", bind);
            channel.disconnect();
        };
    }, []);

    const handlePressButton = (event: React.KeyboardEvent) => {
        if (event.key === "r" && subDragInfos.index >= 0) {
            rotateSub();
        }
    };

    const bind = (message: any) => {
        console.log(message);
    };

    const rotateSub = () => {
        setSubmarines(subs =>
            subs.map(sub =>
                sub.index === subDragInfos.index
                    ? {
                          posX: sub.posX,
                          posY: sub.posY,
                          size: sub.size,
                          index: sub.index,
                          horizontal: !sub.horizontal,
                      }
                    : sub
            )
        );
    };

    const handleDragStart = (dragInfos: {
        horizontal: boolean;
        pos: number;
        size: number;
        index: number;
        shiftX: number;
        shiftY: number;
    }) => {
        !isGameStart && setSubDragInfos(dragInfos);
    };

    const onMouseMove = (event: React.MouseEvent) => {
        if (subDragInfos.index >= 0) {
            moveSub(subDragInfos.index, event.pageX - subDragInfos.shiftX, event.pageY - subDragInfos.shiftY);
        }
    };

    function moveSub(SubIndex: number, x: number, y: number) {
        setSubmarines(submarines =>
            submarines.map((v, i) =>
                i != SubIndex ? v : { posX: x, posY: y, size: v.size, index: v.index, horizontal: v.horizontal }
            )
        );
    }
    const onMouseUp = () => {
        setSubDragInfos;
    };

    const gameStart = () => {
        setIsGameStart(true);
        console.log("start the game");
        fetch("http://localhost:3000/pusher/newGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ channel: gameName, map: "example1" }),
        })
            .then(response => response.json())
            .then(data => console.log(data));
    };

    const handleClick = (pos : {x : number, y:number}) => {
        isGameStart && console.log(pos);
    };

    return (
        <div
            tabIndex={0}
            className={styles.main}
            onMouseMove={onMouseMove}
            onKeyDown={handlePressButton}
            onMouseUp={onMouseUp}
        >
            Game : {gameName} / token : {token}
            <div className={styles.playBoards}>
                <PlayBoard
                    subDragInfos={subDragInfos}
                    moveSub={moveSub}
                    onClick={() => null}
                />

                <PlayBoard
                    subDragInfos={null}
                    moveSub={null}
                    onClick={handleClick}
                />
            </div>
            {submarines.map((submarine, i) => (
                <Submarine
                    key={i}
                    {...submarine}
                    handleDragStart={handleDragStart}
                />
            ))}
            <button onClick={gameStart}>Start game</button>
        </div>
    );
}
