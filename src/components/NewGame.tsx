import { useState } from "react";
import { useOnChange } from "@/customHooks";
import { useRouter } from "next/router";
import styles from "@/styles/NewGame.module.css";
import uid from "uid2";

const NewGame = () => {
    const router = useRouter();
    const input = useOnChange("");
    const [erreurString, setErreurString] = useState("");
    const handleValidate = () => {
        if (input.value === "") return setErreurString("Inputs non remplis");
        setErreurString("");
        router.push(`game/${input.value}/${uid(10)}`);
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
