import { useState } from "react";
import { useOnChange } from "@/customHooks";
import { useRouter } from "next/router";
import styles from "@/styles/NewGame.module.css";
import btnStyle from "@/styles/button.module.css";
import { gameApiServices } from "@/services";
import { Button } from "./Button";
import { Input } from "./Input";

const NewGame = () => {
    const router = useRouter();
    const gameNameInput = useOnChange("");
    const userNameInput = useOnChange("");
    const [erreurString, setErreurString] = useState<string>("");

    const handleValidate = async () => {
        setErreurString("")
        if (gameNameInput.value === "" || userNameInput.value === "") return setErreurString("Inputs non remplis");
        setErreurString("");
        const response = await gameApiServices.newGame(gameNameInput.value, userNameInput.value);
        if (!response.result) return setErreurString(response.error);
        router.push(`game/${gameNameInput.value}/${response.data.playerId};false`);
    };

    return (
        <div className={styles.main}>
            <h1>Création de partie</h1>
            <div className={styles.content}>
                <Input
                    placeholder="Nom de la partie"
                    {...gameNameInput}
                />
                <Input
                    placeholder="Nom du joueur"
                    {...userNameInput}
                />
                <span className={styles.errMessage}> {erreurString && erreurString}</span>
                <Button
                    text="Créer partie"
                    onClick={handleValidate}
                />
            </div>
        </div>
    );
};

export { NewGame };
