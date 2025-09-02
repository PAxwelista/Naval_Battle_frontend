import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "@/styles/Game.module.css";
import subStyle from "@/styles/Submarine.module.css";
import { Board } from "./Board";
import { GameProps, Grid, SubDragInfosType, Pos } from "@/types";
import { usePusherChannel } from "@/customHooks";
import { createEmptyGrid } from "@/utils";
import { gameApiServices } from "@/services";
import { useTranslation } from "react-i18next";
import { Shoot } from "./Shoot";
import { Parallax } from "./Parallax";
import Image from "next/image";

const defaultSubDragInfos = {
    horizontal: true,
    dragSectionIndex: -1,
    subSize: -1,
    index: -1,
    shiftX: -1,
    shiftY: -1,
};

export const Game = ({ gameName, isJoining, playerId }: GameProps) => {
    const { t } = useTranslation();
    const [playerGrid, setPlayerGrid] = useState<Grid>(createEmptyGrid("-", 8));
    const [opponentGrid, setOpponentGrid] = useState<Grid>(createEmptyGrid("-", 8));
    const [rotateSubSwitch, setRotateSubSwitch] = useState<boolean>(false);
    const [subDragInfos, setSubDragInfos] = useState<SubDragInfosType>(defaultSubDragInfos);
    const [hasTwoPlayers, setHasTwoPlayers] = useState<boolean>(isJoining === "true");
    const [nbPlayerReady, setNbPlayerReady] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [dragPos, setDragPos] = useState<Pos>({ x: 0, y: 0 });
    const [triggerShoot, setTriggerShoot] = useState<boolean>(false);
    const [shootPos, setShootPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

    const stableEventNames = useMemo(() => ["joinGame", "initialiseBoard", "shoot"], []);

    useEffect(() => {
        return () => {
            if (isJoining === "true") return;
            handleEndGame();
        };
    }, []);

    const isGameStart = nbPlayerReady === 2;

    const handleJoinGame = useCallback((data: Record<string, string>): void => {
        const { playerId: bindPlayerId } = data;
        if (bindPlayerId === playerId) return;
        setMessage("APlayerHasJoinedTheGame");
        setHasTwoPlayers(true);
    }, []);

    const handleInitialiseBoard = useCallback((data: Record<string, string>): void => {
        const { playerId: bindPlayerId } = data;
        setNbPlayerReady(nbPlayer => {
            const newNbPlayers = nbPlayer + 1;

            if (newNbPlayers > 1) setMessage("TheGameCanBegin");
            else if (bindPlayerId !== playerId) setMessage("TheOtherPlayerIsWaiting");

            return newNbPlayers;
        });
    }, []);

    const handleShoot = useCallback((data: Record<string, string>): void => {
        const { shootPosX, shootPosY, shootSuccessfull, gameEnd } = data;
        if (data.playerId === playerId) return;

        setMessage(shootSuccessfull ? "TheOtherPlayerHitYou" : "TheOtherPlayerMissYou");
        setPlayerGrid(grid =>
            grid.map((line, i) =>
                line.map((v, j) =>
                    i === Number(shootPosY) && j === Number(shootPosX) ? (shootSuccessfull ? "F" : "X") : v
                )
            )
        );
        if (gameEnd) {
            setMessage("TheGameIsFinishedYouLose");
            return handleEndGame();
        }
    }, []);

    const stableOnEvents = useMemo(() => [handleJoinGame, handleInitialiseBoard, handleShoot], []);
    usePusherChannel(gameName, stableEventNames, stableOnEvents);

    const handleEndGame = () => {
        gameApiServices.endGame(gameName);
    };

    const handlePressButton = (event: React.KeyboardEvent) => {
        if (event.key === "r" && subDragInfos.index >= 0) {
            setRotateSubSwitch(prev => !prev);
        }
    };

    const onPointerMove = (event: React.PointerEvent) => {
        event.preventDefault();
        if (subDragInfos.index >= 0) {
            setDragPos({ x: event.pageX - subDragInfos.shiftX, y: event.pageY - subDragInfos.shiftY });
        }
    };

    const handleReady = async () => {
        const response = await gameApiServices.initialiseBoard(gameName, playerId, playerGrid);
        if (!response.result) {
            setMessage(response.error === "The game can begin" ? "TheGameCanBegin" : response.error);
        }
        if (nbPlayerReady < 1) setMessage("WaitingForTheOtherPlayer");
        setReady(response.result);
    };

    const handleStartShoot = (pos: Pos) => {
        setShootPos(pos);
        setTriggerShoot(prev => !prev);
    };

    const handleClick = async (pos: { x: number; y: number }, pageX: number, pageY: number): Promise<void> => {
        setMessage("");
        if (!isGameStart) return;
        const response = await gameApiServices.shoot(gameName, playerId, pos);
        if (!response.result)
            return setMessage(
                response.error === "Wrong player is playing"
                    ? "ItsNotYourTurn"
                    : response.error === "Player already shoot at this position"
                    ? "AlreadyShootAtThisPos"
                    : response.error
            );
        handleStartShoot({ x: pageX, y: pageY });
        setTimeout(() => {
            setMessage(response.data.shootSuccessfull ? "YouHit" : "YouMissTheShoot");
            setOpponentGrid(grid =>
                grid.map((line, i) =>
                    line.map((v, j) => (i === pos.y && j === pos.x ? (response.data.shootSuccessfull ? "F" : "X") : v))
                )
            );
            if (response.data.gameEnd) {
                setMessage("TheGameIsFinishedYouWin");
                return handleEndGame();
            }
        }, 1000);
    };

    const style = {
        cursor: subDragInfos.index >= 0 && !isGameStart ? "grabbing" : "default",
    };

    return (
        <Parallax
            background={
                <Image
                height={1000}
                width={2000}
                    src={require(`/public/images/backgroundHome.jpg`)}
                    alt={"war image"}
                />
            }
            backgroundMultiplier={30}
            foreGroundMultiplier={10}
        >
            <div
                tabIndex={0}
                className={styles.main}
                onPointerMove={onPointerMove}
                onKeyDown={handlePressButton}
                style={style}
            >
                <h1 className={styles.text}>
                    {t("Game")} : {gameName}
                </h1>

                <p className={`${styles.message} ${styles.text}`}>{message && t(message)}</p>
                <div className={styles.playBoards}>
                    <div className={ready ? subStyle.gameStarted : subStyle.gameNotStarted}>
                        <p className={styles.text}>{t("PlaceHere")}</p>
                        <Board
                            subDragInfos={subDragInfos}
                            setSubDragInfos={setSubDragInfos}
                            grid={playerGrid}
                            setGrid={setPlayerGrid}
                            rotateSubSwitch={rotateSubSwitch}
                            dragPos={dragPos}
                            ready={ready}
                        />
                    </div>

                    <div>
                        <p className={styles.text}>{t("ShootHere")}</p>
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
                    className={styles.btn}
                >
                    {t("Ready")}
                </button>
                <Shoot
                    triggerShoot={triggerShoot}
                    pos={shootPos}
                    time={1}
                />
            </div>
        </Parallax>
    );
};
