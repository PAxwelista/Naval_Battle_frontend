import { useEffect, useRef, useState } from "react";
import styles from "../styles/Shoot.module.css";
import { Pos } from "@/types";

type Props = {
    triggerShoot: boolean;
    pos: Pos;
    time: number;
};

export const Shoot = ({ triggerShoot, pos, time }: Props) => {
    const Ref = useRef<null | any>(null);

    const [animating, setAnimating] = useState<boolean>(true);

    useEffect(() => {
        handleShoot();
        setAnimating(false);
    }, [triggerShoot]);

    const handleShoot = () => {
        if (animating) return;
        setAnimating(true);

        const duration = time * 1000;
        const start = performance.now();

        const step = (timeStamp: number) => {
            const elapsed = timeStamp - start;
            const t = Math.min(elapsed / duration, 1);

            const x = pos.x * t ** 1.3 + t * 150;
            const y = pos.y * (1 - Math.sin(Math.PI * t) / 4);
            const scale = 1 - t / 1.2;
            Ref.current.style.opacity = 1;
            Ref.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                Ref.current.style.opacity = 0;
            }
        };

        requestAnimationFrame(step);
    };

    return (
        <div
            ref={Ref}
            className={styles.main}
        ></div>
    );
};
