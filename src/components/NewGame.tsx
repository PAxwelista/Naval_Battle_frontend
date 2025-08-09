import { useState } from "react";
import { useOnChange } from "@/customHooks";
import { useRouter } from "next/router";
import styles from "@/styles/NewGame.module.css";

const NewGame = () => {
    const router = useRouter();
    const input = useOnChange("");
    const [erreurString, setErreurString] = useState("");
    const handleValidate =async () => {
        if (input.value === "") return setErreurString("Inputs non remplis");
        setErreurString("");
        const response = await fetch("http://localhost:3000/pusher/newGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameName: input.value ,playerName:"Gérard" }),
        })
        const data = await response.json()
        router.push(`game/${input.value}/${data.playerId};false`);
    };

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <input
                    className={styles.input}
                    placeholder="Nom de la partie"
                    {...input}
                />
                {erreurString && <span className={styles.errMessage}> {erreurString}</span>}
                <button
                    className={styles.btn}
                    onClick={handleValidate}
                >
                    Prêt
                </button>
            </div>
        </div>
    );
};

export { NewGame };
