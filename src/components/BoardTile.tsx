import styles from "@/styles/BoardCase.module.css";
import { BoardTileType } from "@/types";

const BoardTile = ({ shipPassing, pos, onDragEnter, onDrop, onDragLeave, canDragAndDrop, onClick }: BoardTileType) => {
    const dragItemHover = { backgroundColor: shipPassing ? "red" : "burlywood" };

    const handleClick = () => {
        onClick(pos);
    };

    return (
        <div
            className={styles.main}
            onMouseOver={() => canDragAndDrop && onDragEnter(pos)}
            onMouseLeave={() => {canDragAndDrop && onDragLeave()}}
            onMouseUp={event => canDragAndDrop && onDrop(pos, event)}
            style={dragItemHover}
            onClick={handleClick}
            onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
            }}
        ></div>
    );
};

export { BoardTile };
