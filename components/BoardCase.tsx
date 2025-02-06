import styles from "../src/styles/BoardCase.module.css";

type caseProps = {
    shipPassing: boolean;
    ship: boolean;
    pos: { x: number; y: number };
    onDragEnter: Function;
    onDrop: Function;
    onDragLeave: Function;
};

export default function BoardCase({ shipPassing, ship, pos, onDragEnter, onDrop, onDragLeave }: caseProps) {
    const dragItemHover = { backgroundColor: shipPassing ? "red" : "burlywood" };
    return (
        <div
            className={styles.main}
            onDragEnter={() => onDragEnter(pos)}
            onDragLeave={() => onDragLeave(pos)}
            style={dragItemHover}
            onDrop={event => onDrop(event, pos)}
            onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            {ship && <div className={styles.submarine}></div>}
        </div>
    );
}
