import styles from "@/styles/Home.module.css";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("HomeTitle")}</h1>
            </div>
            <div className={styles.content}>
                <Button
                    text={t("NewGame")}
                    href="/newGame"
                />
                <Button
                    text={t("JoinGame")}
                    href="/joinGame"
                />
            </div>
        </div>
    );
};

export { Home };
