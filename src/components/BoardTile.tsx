import { FireState } from "@/enum";
import styles from "@/styles/BoardTile.module.css";
import { BoardTileType } from "@/types";

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
    const style = {
        width: tileSize,
        height: tileSize,
        boxShadow:shipPassing?"#C2A47A 3px 3px 6px 0px inset" :undefined,
        backgroundColor:
            fireState === FireState.missFire
                ? "orange"
                : fireState === FireState.successFire
                ? "green"
                : shipPassing
                ? "#F2D6B3"
                : "burlywood",
    };
    //box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
    const handleClick = () => {
        onClick(pos);
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
        ></div>
    );
};

export { BoardTile };
