import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gameApiServices } from "@/services";
import { Game } from "@/types";
import { GameDisplay } from "./GameDisplay";
import styles from "../styles/JoinGame.module.css";

const JoinGame = () => {
    const router = useRouter();
    const [games, setGames] = useState<Game[]>([]);
    const [message, setMessage] = useState<string>("");
    useEffect(() => {
        (async () => {
            const response = await gameApiServices.getChannels();
            if (!response.result) return setMessage(`Erreur : ${response.error}`);
            setGames(response.data);
        })();
    }, []);
    const handleClick = async (channel: string) => {
        const response = await gameApiServices.joinGame(channel, "Axel");

        if (!response.result) return setMessage(`Erreur : ${response.error}`);
        router.push(`game/${channel}/${response.data.playerId};true`);
    };

    const Servers = games.map(game => (
        <GameDisplay
            key={game.gameName}
            gameName={game.gameName}
            host={game.firstPlayer.name}
            onClick={() => handleClick(game.gameName)}
        />
    ));

    return (
        <div className={styles.main}>
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Liste des parties en cours</h1>
                <p>{message}</p>
            </div>

            <div className={styles.body}>{Servers}</div>
        </div></div>
    );
};

export { JoinGame };
