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
}: BoardTileType) => {
    const style = {
        backgroundColor:
            fireState === FireState.missFire
                ? "orange"
                : fireState === FireState.successFire
                ? "green"
                : shipPassing
                ? "red"
                : "burlywood",
    };

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
