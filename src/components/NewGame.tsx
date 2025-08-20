import { useState } from "react";
import { useOnChange } from "@/customHooks";
import { useRouter } from "next/router";
import styles from "@/styles/NewGame.module.css";
import { gameApiServices } from "@/services";
import { Button } from "./Button";
import { Input } from "./Input";
import { isAlphanumeric } from "@/utils/string";
import { useTranslation } from "react-i18next";

const NewGame = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const gameNameInput = useOnChange("");
    const userNameInput = useOnChange("");
    const [erreurString, setErreurString] = useState<string>("");

    const handleValidate = async () => {
        setErreurString("");
        if (gameNameInput.value === "" || userNameInput.value === "") return setErreurString("InputEmpty");
        if (!isAlphanumeric(gameNameInput.value))
            return setErreurString("GameNameInvalid");
        const response = await gameApiServices.newGame(gameNameInput.value, userNameInput.value);
        if (!response.result) return setErreurString(response.error);
        router.push(`game/${gameNameInput.value}/${response.data.playerId};false`);
    };

    return (
        <div className={styles.main}>
            <h1>{t("GameCreation")}</h1>
            <div className={styles.content}>
                <Input
                    placeholder={t("GameName")}
                    {...gameNameInput}
                />
                <Input
                    placeholder={t("PlayerName")}
                    {...userNameInput}
                />
                <span className={styles.errMessage}> {erreurString && t(erreurString)}</span>
                <Button
                    text={t("CreateGame")}
                    onClick={handleValidate}
                />
            </div>
        </div>
    );
};

export { NewGame };
