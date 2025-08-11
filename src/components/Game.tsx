import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Game.module.css";
import { Submarine } from "./Submarine";
import { BoardGame } from "./BoardGame";
import { GameProps, Grid, initialSubmarineType, SubDragInfosType } from "@/types";
import { usePusherChannel } from "@/customHooks";
import { createEmptyGrid } from "@/utils";
import { gameApiServices } from "@/services";

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

export const Game = ({ gameName, isJoining, playerId }: GameProps) => {
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
            if (isJoining) return;
            handleEndGame();
        };
    }, []);
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

    const handleEndGame = () => {
        setMessage("La partie est fini");
        gameApiServices.endGame(gameName);
    };

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
        const response = await gameApiServices.initialiseBoard(gameName, playerId, playerGrid);
        if (!response.result) {
            setMessage(response.error);
        }
        setReady(response.result);
    };

    const handleClick = async (pos: { x: number; y: number }) => {
        setMessage("");
        if (!isGameStart) return;
        const response = await gameApiServices.shoot(gameName,playerId,pos)
        if (!response.result) return setMessage(response.error);
        if (response.data.gameEnd) return handleEndGame();
        setOpponentGrid(grid =>
            grid.map((line, i) =>
                line.map((v, j) => (i === pos.y && j === pos.x ? (response.data.shootSuccessfull ? "F" : "X") : v))
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
            <h1>Partie : {gameName}</h1>
            <p>hello</p>
            {message && message}
            <div className={styles.playBoards}>
                <div><p>Votre terrain</p><BoardGame
                    subDragInfos={subDragInfos}
                    moveSub={moveSub}
                    onClick={() => null}
                    grid={playerGrid}
                    setGrid={setPlayerGrid}
                /></div>

                <div><p>Le terrain de l'adversaire</p><BoardGame
                    subDragInfos={null}
                    moveSub={() => {}}
                    onClick={handleClick}
                    grid={opponentGrid}
                    setGrid={setOpponentGrid}
                /></div>
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