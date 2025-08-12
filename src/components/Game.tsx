import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Game.module.css";
import subStyle from "@/styles/Submarine.module.css";
import { Board } from "./Board";
import { GameProps, Grid, SubDragInfosType, Pos } from "@/types";
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

    useEffect(() => {
        return () => {
            if (isJoining === "true") return;
            handleEndGame();
        };
    }, []);

    const isGameStart = nbPlayerReady === 2;

    usePusherChannel(
        gameName,
        ["joinGame", "initialiseBoard", "shoot"],
        [handleJoinGame, handleInitialiseBoard, handleShoot]
    );

    function handleJoinGame(data: Record<string, string>): void {
        const { playerId: bindPlayerId } = data;
        if (bindPlayerId === playerId) return;
        setMessage("Le deuxième joueur vient de rejoindre la partie");
        setHasTwoPlayers(true);
    }
    function handleInitialiseBoard(data: Record<string, string>): void {
        const { playerId: bindPlayerId } = data;
        setNbPlayerReady(nbPlayer => nbPlayer + 1);
        if (nbPlayerReady >= 1) {
            return setMessage("La partie peux commencer");
        }
        if (bindPlayerId === playerId) return;
        setMessage("Le deuxième joueur vous attend");
    }
    function handleShoot(data: Record<string, string>): void {
        const { shootPosX, shootPosY, shootSuccessfull, gameEnd } = data;
        if (data.playerId === playerId) return;

        setMessage(`Le deuxième joueur vous à ${shootSuccessfull ? "touché" : "raté"}`);
        setPlayerGrid(grid =>
            grid.map((line, i) =>
                line.map((v, j) =>
                    i === Number(shootPosY) && j === Number(shootPosX) ? (shootSuccessfull ? "F" : "X") : v
                )
            )
        );
        if (gameEnd) {
            setMessage("La partie est fini, vous avez perdu");
            return handleEndGame();
        }
    }

    const handleEndGame = () => {
        gameApiServices.endGame(gameName);
    };

    const handlePressButton = (event: React.KeyboardEvent) => {
        if (event.key === "r" && subDragInfos.index >= 0) {
            setRotateSubSwitch(prev => !prev);
        }
    };

    // const onMouseMove = (event: React.MouseEvent) => {
    //     if (subDragInfos.index >= 0) {
    //         setDragPos({ x: event.pageX - subDragInfos.shiftX, y: event.pageY - subDragInfos.shiftY });
    //     }
    // };
    const onPointerMove =(event : React.PointerEvent)=>{
        event.preventDefault()
        if (subDragInfos.index >= 0) {
            setDragPos({ x: event.pageX - subDragInfos.shiftX, y: event.pageY - subDragInfos.shiftY });
        }
    }

    const handleReady = async () => {
        const response = await gameApiServices.initialiseBoard(gameName, playerId, playerGrid);
        if (!response.result) {
            setMessage(response.error);
        }
        if (nbPlayerReady < 1) setMessage("En attente de l'autre joueur");
        setReady(response.result);
    };

    const handleClick = async (
        pos: { x: number; y: number }): Promise<void> => {
        setMessage("");
        if (!isGameStart) return;
        const response = await gameApiServices.shoot(gameName, playerId, pos);
        if (!response.result) return setMessage(response.error);

        setMessage(`Vous avez ${response.data.shootSuccessfull ? "touché" : "raté"}`);
        setOpponentGrid(grid =>
            grid.map((line, i) =>
                line.map((v, j) => (i === pos.y && j === pos.x ? (response.data.shootSuccessfull ? "F" : "X") : v))
            )
        );
        if (response.data.gameEnd) {
            setMessage("La partie est fini, vous avez gagné");
            return handleEndGame();
        }
    };
    const style = {
        cursor: subDragInfos.index >= 0 && !isGameStart ? "grabbing" : "default",
    };

    return (
        <div
            tabIndex={0}
            className={styles.main}
            onPointerMove={onPointerMove}
            onKeyDown={handlePressButton}
            style={style}
        >
            <h1 className={styles.text}>Partie : {gameName}</h1>

            <p className={`${styles.message} ${styles.text}`}>{message && message}</p>
            <div className={styles.playBoards}>
                <div className={isGameStart ? subStyle.gameStarted : subStyle.gameNotStarted}>
                    <p className={styles.text}>Votre terrain</p>
                    <Board
                        subDragInfos={subDragInfos}
                        setSubDragInfos={setSubDragInfos}
                        grid={playerGrid}
                        setGrid={setPlayerGrid}
                        rotateSubSwitch={rotateSubSwitch}
                        dragPos={dragPos}
                        isGameStart={isGameStart}
                    />
                </div>

                <div>
                    <p className={styles.text}>Le terrain de l'adversaire</p>
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
