import { FireState } from "@/enum";
import styles from "@/styles/BoardTile.module.css";
import { BoardTileType } from "@/types";
import { useEffect, useState } from "react";
import { ShootAnimation } from "./ShootAnimation";

const BoardTile = ({
    shipPassing,
    pos,
    onDragEnter,
    onDrop,
    onDragLeave,
    canDragAndDrop,
    onClick,
    fireState,
    tileSize,
}: BoardTileType) => {
    const [triggerWave, setTriggerWave] = useState<boolean>(false);

    useEffect(() => {
        if (fireState === FireState.missFire ||fireState === FireState.successFire ) {
            setTriggerWave(prev => !prev);
        }
    }, [fireState]);

    const style = {
        width: tileSize,
        height: tileSize,
        boxShadow: shipPassing ? "grey 3px 3px 6px 0px inset" : undefined,
        backgroundColor:
            fireState === FireState.missFire
                ? "grey"
                : fireState === FireState.successFire
                ? "#fa5c5c"
                : shipPassing
                ? "lightGrey"
                : "rgb(181, 179, 179)",
    };
    //box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
    const handleClick = (event : React.MouseEvent) => {
        onClick(pos,event.pageX,event.pageY);
    };

    return (
        <div
            className={styles.main}
            onMouseOver={() => canDragAndDrop && onDragEnter(pos)}
            onMouseLeave={() => {
                canDragAndDrop && onDragLeave();
            }}
            onMouseUp={event => canDragAndDrop && onDrop(pos, event)}
            style={style}
            onClick={handleClick}
            onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <ShootAnimation triggeraWave={triggerWave} successFire={fireState === FireState.successFire} />
        </div>
    );
};

export { BoardTile };
