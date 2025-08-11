import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Game.module.css";
import subStyle from "@/styles/Submarine.module.css";
import { Board } from "./Board";
import { GameProps, Grid, SubmarineType, SubDragInfosType, Pos } from "@/types";
import { usePusherChannel } from "@/customHooks";
import { createEmptyGrid } from "@/utils";
import { gameApiServices } from "@/services";

const defaultSubDragInfos = {
    horizontal: true,
    dragSectionIndex: -1,
    subSize: -1,
    index: -1,
    shiftX: -1,
    shiftY: -1,
};

export const Game = ({ gameName, isJoining, playerId }: GameProps) => {
    const [playerGrid, setPlayerGrid] = useState<Grid>(createEmptyGrid("-", 8));
    const [opponentGrid, setOpponentGrid] = useState<Grid>(createEmptyGrid("-", 8));
    const [rotateSubSwitch, setRotateSubSwitch] = useState<boolean>(false);
    const [subDragInfos, setSubDragInfos] = useState<SubDragInfosType>(defaultSubDragInfos);
    const [hasTwoPlayers, setHasTwoPlayers] = useState<boolean>(isJoining === "true");
    const [nbPlayerReady, setNbPlayerReady] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [dragPos, setDragPos] = useState<Pos>({ x: 0, y: 0 });
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
    }
    function handleInitialiseBoard(data: Record<string, string>): void {
        const { playerId } = data;
        setNbPlayerReady(nbPlayer => nbPlayer + 1);
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
            setRotateSubSwitch(prev => !prev);
        }
    };

    const onMouseMove = (event: React.MouseEvent) => {
        if (subDragInfos.index >= 0) {
            setDragPos({ x: event.pageX - subDragInfos.shiftX, y: event.pageY - subDragInfos.shiftY });
        }
    };

    const handleReady = async () => {
        const response = await gameApiServices.initialiseBoard(gameName, playerId, playerGrid);
        if (!response.result) {
            setMessage(response.error);
        }
        setReady(response.result);
    };

    const handleClick = async (pos: { x: number; y: number }):Promise<void> => {
        setMessage("");
        if (!isGameStart) return;
        const response = await gameApiServices.shoot(gameName, playerId, pos);
        if (!response.result) return setMessage(response.error);
        if (response.data.gameEnd) return handleEndGame();
        setOpponentGrid(grid =>
            grid.map((line, i) =>
                line.map((v, j) => (i === pos.y && j === pos.x ? (response.data.shootSuccessfull ? "F" : "X") : v))
            )
        );
    };
    const style = {
        cursor: subDragInfos.index >= 0 && !isGameStart ? "grabbing" : "default",
    };

    return (
        <div
            tabIndex={0}
            className={styles.main}
            onMouseMove={onMouseMove}
            onKeyDown={handlePressButton}
            style={style}
        >
            <h1>Partie : {gameName}</h1>
            <p>hello</p>
            {message && message}
            <div className={styles.playBoards}>
                <div className={isGameStart ? subStyle.gameStarted : subStyle.gameNotStarted}>
                    <p>Votre terrain</p>
                    <Board
                        subDragInfos={subDragInfos}
                        setSubDragInfos={setSubDragInfos}
                        grid={playerGrid}
                        setGrid={setPlayerGrid}
                        rotateSubSwitch={rotateSubSwitch}
                        dragPos={dragPos}
                        isGameStart= {isGameStart}
                    />
                </div>

                <div>
                    <p>Le terrain de l'adversaire</p>
                    <Board
                        subDragInfos={null}
                        onClick={handleClick}
                        grid={opponentGrid}
                        setGrid={setOpponentGrid}
                    />
                </div>
            </div>

            <button
                onClick={handleReady}
                disabled={!hasTwoPlayers || ready}
            >
                Prêt
            </button>
        </div>
    );
};
