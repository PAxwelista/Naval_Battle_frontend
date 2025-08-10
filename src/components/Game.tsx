import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Game.module.css";
import { Submarine } from "./Submarine";
import { BoardGame } from "./BoardGame";
import { Grid, initialSubmarineType, SubDragInfosType } from "@/types";
import { usePusherChannel } from "@/customHooks";
import { createEmptyGrid } from "@/utils";
import { apiUrl } from "@/config";

type Props = {
    gameName: string;
    isJoining: string;
    playerId: string;
};

const initialSubmarines = [
    { posX: 30, posY: 20, size: 2, index: 0, horizontal: false },
    { posX: 660, posY: 40, size: 3, index: 1, horizontal: true },
];

const defaultSubDragInfos = {
    horizontal: true,
    dragSectionIndex: -1,
    size: -1,
    index: -1,
    shiftX: -1,
    shiftY: -1,
};

const Game = ({ gameName, isJoining, playerId }: Props) => {
    const [playerGrid, setPlayerGrid] = useState<Grid>(createEmptyGrid("-", 8));
    const [opponentGrid, setOpponentGrid] = useState<Grid>(createEmptyGrid("-", 8));
    const [submarines, setSubmarines] = useState<initialSubmarineType[]>(initialSubmarines);
    const [subDragInfos, setSubDragInfos] = useState<SubDragInfosType>(defaultSubDragInfos);
    const [hasTwoPlayers, setHasTwoPlayers] = useState<boolean>(isJoining === "true");
    const [nbPlayerReady, setNbPlayerReady] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const firstRun = useRef(true);

    const isGameStart = nbPlayerReady === 2;
    useEffect(() => {
        return () => {
          if (firstRun.current) {
            firstRun.current = false;
            return;
          }
          if (isJoining) return
          handleEndGame()
        };
      }, []);

    const handleEndGame = () => {
        setMessage("La partie est fini");
        fetch(`${apiUrl}/pusher/endGame`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameName }),
        });
    };

    usePusherChannel(
        gameName,
        ["joinGame", "initialiseBoard", "shoot"],
        [handleJoinGame, handleInitialiseBoard, handleShoot]
    );

    function handleJoinGame(data: Record<string, string>): void {
        setHasTwoPlayers(true);
        console.log(data.info);
    }
    function handleInitialiseBoard(data: Record<string, string>): void {
        const { playerId } = data;
        setNbPlayerReady(nbPlayer => nbPlayer + 1);
        console.log(playerId);
    }
    function handleShoot(data: Record<string, string>): void {
        const { shootPosX, shootPosY, shootSuccessfull, gameEnd } = data;
        if (data.playerId === playerId) return;
        if (gameEnd) return handleEndGame();
        setPlayerGrid(grid =>
            grid.map((line, i) =>
                line.map((v, j) =>
                    i === Number(shootPosY) && j === Number(shootPosX) ? (shootSuccessfull ? "F" : "X") : v
                )
            )
        );
    }

    const handlePressButton = (event: React.KeyboardEvent) => {
        if (event.key === "r" && subDragInfos.index >= 0) {
            rotateSub();
        }
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
        setSubDragInfos(prev => ({ ...prev, horizontal: !prev.horizontal }));
    };

    const handleDragStart = (dragInfos: SubDragInfosType) => {
        !isGameStart && setSubDragInfos(dragInfos);
    };

    const onMouseMove = (event: React.MouseEvent) => {
        if (subDragInfos.index >= 0) {
            moveSub(subDragInfos.index, event.pageX - subDragInfos.shiftX, event.pageY - subDragInfos.shiftY);
        }
    };

    const moveSub = (SubIndex: number, x: number, y: number) => {
        setSubmarines(submarines =>
            submarines.map((v, i) =>
                i != SubIndex ? v : { posX: x, posY: y, size: v.size, index: v.index, horizontal: v.horizontal }
            )
        );
    };
    const onMouseUp = () => {
        setSubDragInfos;
    };

    const handleReady = async () => {
        const response = await fetch(`${apiUrl}/pusher/initialiseBoard`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameName, playerId, board: playerGrid }),
        });
        const data = await response.json();
        setReady(true);
        console.log(data);
    };

    const handleClick = async (pos: { x: number; y: number }) => {
        if (!isGameStart) return;
        const response = await fetch(`${apiUrl}/pusher/shoot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameName, playerId, shootPos: pos }),
        });
        const data:
            | { result: true; shootInfos: { shootSuccessfull: boolean; gameEnd: boolean } }
            | { result: false; error: string } = await response.json();
        if (!data.result) return setMessage(data.error);
        if (data.shootInfos.gameEnd) return handleEndGame();
        setOpponentGrid(grid =>
            grid.map((line, i) =>
                line.map((v, j) => (i === pos.y && j === pos.x ? (data.shootInfos.shootSuccessfull ? "F" : "X") : v))
            )
        );
    };

    return (
        <div
            tabIndex={0}
            className={styles.main}
            onMouseMove={onMouseMove}
            onKeyDown={handlePressButton}
            onMouseUp={onMouseUp}
        >
            Game : {gameName}
            {message && message}
            <div className={styles.playBoards}>
                <BoardGame
                    subDragInfos={subDragInfos}
                    moveSub={moveSub}
                    onClick={() => null}
                    grid={playerGrid}
                    setGrid={setPlayerGrid}
                />

                <BoardGame
                    subDragInfos={null}
                    moveSub={() => {}}
                    onClick={handleClick}
                    grid={opponentGrid}
                    setGrid={setOpponentGrid}
                />
            </div>
            {submarines.map((submarine, i) => (
                <Submarine
                    key={i}
                    {...submarine}
                    handleDragStart={handleDragStart}
                />
            ))}
            <button
                onClick={handleReady}
                disabled={!hasTwoPlayers || ready}
            >
                Prêt
            </button>
        </div>
    );
};

export { Game };
