import styles from "../src/styles/BoardCase.module.css";

type caseProps = {
    shipPassing: boolean;
    pos: { x: number; y: number };
    onDragEnter: Function;
    onDrop: Function;
    onDragLeave: Function;
    subDragInfos: { horizontal: boolean; pos: number; size: number; index: number } | null;
    onClick : Function
};

export default function BoardCase({
    shipPassing,
    pos,
    onDragEnter,
    onDrop,
    onDragLeave,
    subDragInfos,
    onClick
}: caseProps) {

    const dragItemHover = { backgroundColor: shipPassing ? "red" : "burlywood" };

    const handleClick=()=>{
        onClick(pos)
    }

    return (
        <div
            className={styles.main}
            onMouseOver={() => subDragInfos && subDragInfos.index >= 0 && onDragEnter(pos)}
            onMouseLeave={() => subDragInfos && subDragInfos.index >= 0 && onDragLeave(pos)}
            onMouseUp={(event) => subDragInfos && subDragInfos.index >= 0 && onDrop(pos,event)}
            style={dragItemHover}
            onClick={handleClick}
            onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
        </div>
    );
}
