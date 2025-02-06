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
});

const initialSubmarines = [
    { posX: 30, posY: 20, size: 2, index: 0 ,horizontal :false},
    { posX: 660, posY: 40, size: 3, index: 1 ,horizontal :true},
];

export default function Game({ gameName, token }: gameProps) {
    const [submarines, setSubmarines] = useState(initialSubmarines);
    const [subDragInfos, setSubDragInfos] = useState({ horizontal: true, pos: -1, size: -1, index: -1 });
    useEffect(() => {
        const channel = pusher.subscribe(gameName);
        channel.bind("mess", (message: any) => {
            alert(message);
        });
        return () => {
            pusher.unsubscribe(gameName);
            channel.disconnect();
        };
        
    }, []);

    const handlePressButton=(event : KeyboardEvent)=>{
        console.log("ttest")
        if (event.key === "r"){
            console.log(subDragInfos) 
        }
    }

    const handleDragStart = (dragInfos: { horizontal: boolean; pos: number; size: number; index: number }) => {
        setSubDragInfos(dragInfos);
    };

    function moveSub(SubIndex: number, x: number, y: number) {
        setSubmarines(submarines =>
            submarines.map((v, i) => (i != SubIndex ? v : { posX: x, posY: y, size: v.size, index: v.index ,horizontal: v.horizontal}))
        );
    }

    return (
        <div className={styles.main}  onKeyDown={handlePressButton}>
            Game  : {gameName} / token : {token}
            <PlayBoard
                subDragInfos={subDragInfos}
                moveSub={moveSub}
            />
            {submarines.map((submarine, i) => (
                <Submarine
                    key={i}
                    {...submarine}
                    handleDragStart={handleDragStart}
                />
            ))}
            <button onClick={() => moveSub(0, 20, 60)}>here</button>
            
        </div>
    );
}
