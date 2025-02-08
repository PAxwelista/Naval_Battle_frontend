import styles from "../src/styles/BoardCase.module.css";

type caseProps = {
    shipPassing: boolean;
    ship: boolean;
    pos: { x: number; y: number };
    onDragEnter: Function;
    onDrop: Function;
    onDragLeave: Function;
    subDragInfos: { horizontal: boolean; pos: number; size: number; index: number };
};

export default function BoardCase({
    shipPassing,
    ship,
    pos,
    onDragEnter,
    onDrop,
    onDragLeave,
    subDragInfos,
}: caseProps) {
    const dragItemHover = { backgroundColor: shipPassing ? "red" : "burlywood" };
    return (
        <div
            className={styles.main}
            onMouseOver={() => subDragInfos.index >= 0 && onDragEnter(pos)}
            onMouseLeave={() => subDragInfos.index >= 0 && onDragLeave(pos)}
            onMouseUp={() => subDragInfos.index >= 0 && onDrop(pos)}
            style={dragItemHover}
            onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            {ship && <div className={styles.submarine}></div>}
        </div>
    );
}
