import styles from "@/styles/Home.module.css";
import btnStyle from "@/styles/button.module.css";
import Link from "next/link";
import { Button } from "./Button";

const Home = () => {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <h1 className={styles.title}>Welcome to the Battle!</h1>
            </div>
            <div className={styles.content}>
                <Button
                    text="Nouvelle partie"
                    href="/newGame"
                />
                <Button
                    text="Rejoindre partie"
                    href="/joinGame"
                />
            </div>
        </div>
    );
};

export { Home };
