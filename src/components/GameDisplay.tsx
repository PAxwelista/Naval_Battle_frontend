import { GameDisplayProps } from "@/types";
import styles from "../styles/GameDisplay.module.css";

export const GameDisplay = ({ gameName,host, onClick }: GameDisplayProps) => {
    return (
        <button
            className={styles.main}
            onClick={onClick}
        >
            <div className={styles.gameInfos}>Nom de la partie : {gameName}</div>
            <div className={styles.gameInfos}>hôte : {host}</div>
        </button>
    );
};
