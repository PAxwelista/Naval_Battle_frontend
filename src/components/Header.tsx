import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";
import Image from "next/image";

export const Header = () => {
    const { i18n } = useTranslation();
    const router = useRouter();

    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    const handleGoToHomePage = () => {
        router.replace("/");
    };

    return (
        <div className={styles.main}>
            <div className={styles.buttons}>
                <button
                    className={styles.homeButton}
                    onClick={handleGoToHomePage}
                >
                    <Image
                        src={require("../../public/images/homeIcon.png")}
                        width={40}
                        height={40}
                        alt={"Home icon"}
                    />
                </button>
                <div>
                    <button
                        className={styles.button}
                        onClick={() => handleChangeLanguage("fr")}
                    ><span className={styles.flag}>🇫🇷</span></button>
                    <button
                        className={styles.button}
                        onClick={() => handleChangeLanguage("en")}
                    ><span className={styles.flag}>🇬🇧</span></button>
                </div>
            </div>
        </div>
    );
};
