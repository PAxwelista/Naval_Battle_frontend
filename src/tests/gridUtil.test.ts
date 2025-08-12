import {
    gridIncludesValuesInPositions,
    changeGrid,
    createEmptyGrid,
    replaceValuesOnGrid,
    subDragInfosToPositions,
    tranformInitSubPosToSubmarines,
    canFitInTile,
} from "@/utils";

describe("createEmptyGrid function", () => {
    it("should create a new 2D tab with correct params", () => {
        const grid = createEmptyGrid("-", 8);

        expect(grid.length).toBe(8);
        grid.forEach(line => {
            expect(line.length).toBe(8);
            line.forEach(value => expect(value).toBe("-"));
        });
    });

    it("should return a grid with independant rows", () => {
        const grid = createEmptyGrid("-", 8);

        grid[0][3] = "P";

        expect(grid[1][3]).toBe("-");
    });
});

describe("changeGrid function", () => {
    it("should change position value", () => {
        const grid = createEmptyGrid("-", 8);

        const updated = changeGrid(
            grid,
            [
                { x: 1, y: 3 },
                { x: 5, y: 0 },
            ],
            "P"
        );

        const expected = createEmptyGrid("-", 8);
        expected[3][1] = "P";
        expected[0][5] = "P";

        expect(updated).toEqual(expected);
    });
});

describe("replaceValuesOnGrid function", () => {
    it("should change all values on params with the new value", () => {
        const grid = createEmptyGrid("-", 8);
        grid[3][1] = "P";
        grid[0][5] = "P";

        const updated = replaceValuesOnGrid(grid, "P", "1");

        const expected = createEmptyGrid("-", 8);
        expected[3][1] = "1";
        expected[0][5] = "1";

        expect(updated).toEqual(expected);
    });
});

describe("gridIncludesValuesInPositions function", () => {
    it("should return true if a value is in position", () => {
        const grid = createEmptyGrid("-", 8);
        grid[3][1] = "P";

        expect(gridIncludesValuesInPositions(grid, [{ x: 1, y: 3 }], ["P"])).toBeTruthy();
    });
    it("should return true if some values are in positions", () => {
        const grid = createEmptyGrid("-", 8);
        grid[3][1] = "P";
        grid[3][2] = "P";
        grid[1][6] = "8";

        expect(
            gridIncludesValuesInPositions(
                grid,
                [
                    { x: 1, y: 3 },
                    { x: 2, y: 3 },
                    { x: 6, y: 1 },
                ],
                ["P", "8"]
            )
        ).toBeTruthy();
    });
    it("should return false if none of values are in positions", () => {
        const grid = createEmptyGrid("-", 8);
        grid[3][1] = "P";
        grid[3][2] = "P";
        grid[1][6] = "8";

        expect(
            gridIncludesValuesInPositions(
                grid,
                [
                    { x: 1, y: 3 },
                    { x: 2, y: 3 },
                    { x: 6, y: 1 },
                ],
                ["P"]
            )
        ).toBeFalsy();
    });
    it("should return false if a position is out of grid", () => {
        const grid = createEmptyGrid("-", 8);
        grid[3][1] = "P";
        grid[3][2] = "P";
        grid[1][6] = "P";

        expect(
            gridIncludesValuesInPositions(
                grid,
                [
                    { x: 1, y: 3 },
                    { x: 2, y: 3 },
                    { x: 6, y: 1 },
                    { x: 8, y: 8 },
                ],
                ["P"]
            )
        ).toBeFalsy();
    });
});

describe("subDragInfosToPositions function", () => {
    it("should return positions from dragInfos", () => {
        const positions = subDragInfosToPositions(true, { x: 1, y: 1 }, 4, 2);

        expect(positions).toEqual([
            { x: -1, y: 1 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ]);
    });
    it("should return positions from dragInfos with a horizontal false", () => {
        const positions = subDragInfosToPositions(false, { x: 1, y: 1 }, 4, 2);

        expect(positions).toEqual([
            { x: 1, y: -1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
        ]);
    });
    it("should return a empty tab if indexDrag is offlimit", () => {
        const positions = subDragInfosToPositions(true, { x: 1, y: 1 }, 4, 4);

        expect(positions).toEqual([]);
    });
});

describe("tranformInitSubPosToSubmarines frunction", () => {
    it("should return the correct submarines", () => {
        const tileSize = 7
        const initialSubmarines = [
            {
                pos: { x: 50, y: -40 },
                subSize: 2,
                horizontal: false,
            },
            {
                pos: { x: 400, y: 50 },
                subSize: 3,
                horizontal: true,
            },
        ];
        const jestFunction = jest.fn();
        const expected = [
            {
                boardPos: undefined,
                dragPos: { x: 50, y: -40 },
                handleDragStart: jestFunction,
                horizontal: false,
                index: 0,
                pos: { x: 50, y: -40 },
                subSize: 2,
                tileSize,
            },
            {
                boardPos: undefined,
                dragPos: { x: 400, y: 50 },
                handleDragStart: jestFunction,
                horizontal: true,
                index: 1,
                pos: { x: 400, y: 50 },
                subSize: 3,
                tileSize,
            },
        ];
        const submarines = tranformInitSubPosToSubmarines(initialSubmarines, tileSize, jestFunction);
        expect(submarines).toEqual(expected);
    });
});

describe("canFitInTile function" , ()=>{
    it("should return false if the sub is off limit" , ()=>{
        const grid = createEmptyGrid("-",8)
        const positions = [{x:6,y:1} ,{x:9,y:10},{x:-3,y:3} ]
       

        positions.forEach(pos=>expect(canFitInTile(grid,pos,true,3,0,1)).toBeFalsy())
        
    })
    it("should return false if the sub has less than 1 size" , ()=>{
        const grid = createEmptyGrid("-",8)
        const pos = {x:2,y:2}
        const result = canFitInTile(grid,pos,true,0,0,1)
        expect(result).toBeFalsy()
    })
    it("should return false if dragIndex is equal or larger than size" ,()=>{
        const grid = createEmptyGrid("-",8)
        const pos = {x:2,y:2}
        const result = canFitInTile(grid,pos,true,3,3,1)
        expect(result).toBeFalsy()
    })
    it("should return true if the sub can fit" , ()=>{
        const grid = createEmptyGrid("-",8)
        const pos = {x:2,y:2}
        const result = canFitInTile(grid,pos,true,3,2,1)
        expect(result).toBeTruthy()
    })
})
