import { useState } from "react";
import { useOnChange } from "@/customHooks";
import { useRouter } from "next/router";
import styles from "@/styles/NewGame.module.css";
import { gameApiServices } from "@/services";

const NewGame = () => {
    const router = useRouter();
    const input = useOnChange("");
    const [erreurString, setErreurString] = useState("");
    const handleValidate =async () => {

        if (input.value === "") return setErreurString("Inputs non remplis");
        setErreurString("");
        const response = await gameApiServices.newGame(input.value,"Gérard")
        if (!response.result) return setErreurString(response.error);
        router.push(`game/${input.value}/${response.data.playerId};false`);
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
