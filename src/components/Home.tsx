import styles from "@/styles/Home.module.css";
import Link from "next/link";

const  Home=()=> {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <h1 className={styles.title}>Welcome to the Battle!</h1>
            </div>
            <div className={styles.content}>
                <Link
                    href="/newGame"
                    className={styles.link}
                >
                    Nouvelle partie
                </Link>
                <Link
                    href="/joinGame"
                    className={styles.link}
                >
                    Rejoindre partie
                </Link>
            </div>
        </div>
    );
}


export  {Home}