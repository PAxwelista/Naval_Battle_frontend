import { useEffect, useState } from "react";
import styles from "../src/styles/Submarine.module.css";

type submarineProps = {
    posX: number;
    posY: number;
    size: number;
    handleDragStart: Function;
    index: number;
    horizontal: boolean;
};

export default function Submarine({ posX, posY, size, handleDragStart, index, horizontal }: submarineProps) {
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {
        //ce useEffect est utilisé car il est compliqué de gérer le passage de la souris sur les cases du jeux
        //en même temps que le drag'n'drop imporvisé
        if (isDragging) {
            window.addEventListener("mouseup", onEndDrag);
        } else {
            window.removeEventListener("mouseup", onEndDrag);
        }
        return () => window.removeEventListener("mouseup", onEndDrag);
    }, [isDragging]);
    const onStartDrag = (event: React.MouseEvent) => {
        setIsDragging(true);
        const target = event.target as HTMLTextAreaElement;
        //On teste d'abord si il a un element parent (le cas ou on clique en dehors des ronds rouge si c'est null)
        //on prend l'élément direct
        handleDragStart({
            horizontal,
            pos: 1,
            size,
            index,
            shiftX: event.pageX - (target.parentElement?.offsetLeft || target.offsetLeft),
            shiftY: event.clientY - (target.parentElement?.offsetTop || target.offsetTop),
        });
    };
    const onEndDrag = () => {
        setIsDragging(false);
        handleDragStart({ horizontal, pos: 2, size, index: -1, shiftX: -1, shiftY: -1 });
    };

    const subStyle = {
        left: posX,
        top: posY,
        display: "flex",
        flexDirection: horizontal ? ("row" as "row") : ("column" as "column"),
        pointerEvents: isDragging ? ("none" as "none") : ("auto" as "auto"),
    };

    return (
        <div
            onMouseDown={onStartDrag}
            style={subStyle}
            className={styles.submarine}
        >
            {Array.from({ length: size }, (_, i) => i + 1).map((_, i) => (
                <div
                    key={i}
                    className={styles.submarineSection}
                ></div>
            ))}
        </div>
    );
}
