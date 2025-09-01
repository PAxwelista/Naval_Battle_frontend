import { useEffect, useRef, useState } from "react";
import styles from "../styles/ShootAnimation.module.css";
import Image from "next/image";

type Props = {
    triggeraWave: boolean;
    successFire: boolean;
};

export const ShootAnimation = ({ triggeraWave, successFire }: Props) => {
    const ref = useRef<null | any>(null);
    const [animating, setAnimating] = useState<boolean>(true);

    useEffect(() => {
        startWave();
        setAnimating(false);
    }, [triggeraWave]);

    const startWave = () => {
        setAnimating(false);
        if (animating) return;

        const duration = 2000;
        const start = performance.now();

        const step = (timeStamp: number) => {
            const elapsed = timeStamp - start;
            const t = Math.min(elapsed / duration, 1);
            const scale = t * 2;
            ref.current.style.border = successFire ?"none" :"solid blue 4px" ;
            ref.current.style.transform = `scale(${scale})`;
            ref.current.style.opacity = 1 - t;
            if (t < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    return (
        <div
            ref={ref}
            className={styles.main}
        >
            {successFire && <Image src={require(`/public/images/explosion.png`)} alt={"explosion"} height={30} width={30} />}
        </div>
    );
};
