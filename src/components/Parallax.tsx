import { useState } from "react";
import styles from "../styles/Parallax.module.css";
import { Pos } from "@/types";

type Props = {
    background: React.ReactNode;
    children: React.ReactNode;
    backgroundMultiplier:number;
    foreGroundMultiplier:number;
};

export const Parallax = ({ background, children ,backgroundMultiplier , foreGroundMultiplier}: Props) => {
    const [rationPos, setRationPos] = useState<Pos>({ x: 0, y: 0 });

    const handlemouseMove = (event: React.MouseEvent) => {
        setRationPos({ x: event.pageX / window.innerWidth, y: event.pageY / window.innerHeight });
    };
    
    const styleBackground = {transform:`translate(${(rationPos.x-0.5)*backgroundMultiplier}px , ${(rationPos.y-0.5)*backgroundMultiplier}px)`}
    const styleForeground = {transform:`translate(${(rationPos.x-0.5)*foreGroundMultiplier}px , ${(rationPos.y-0.5)*foreGroundMultiplier}px)`}

    return (
        <div
            className={styles.main}
            onMouseMove={handlemouseMove}
        >
            <div className={styles.background} style={styleBackground}>{background}</div>

            <div className={styles.foreGround} style={styleForeground}>{children}</div>
        </div>
    );
};
