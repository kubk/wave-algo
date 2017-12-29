// @flow

export type Cell = [number, number]

export type Matrix = Array<Array<boolean | number>>

export class Maze {
    boolMatrix: Matrix;
    startCell: Cell;
    finishCell: Cell;

    constructor(boolMatrix: Matrix, startCell: ?Cell, finishCell: ?Cell) {
        this.boolMatrix = boolMatrix

        if (startCell) {
            this.setStart(startCell)
        }

        if (finishCell) {
            this.setFinish(finishCell)
        }
    }

    setStart(newStart: Cell): void {
        if (!this.hasCoordinate(newStart)) {
            throw new Error(`Invalid coordinate`)
        }

        if (this.isWall(newStart) || this.isFinish(newStart)) {
            return
        }

        this.startCell = newStart
        this.clearWaves()
    }

    isStart(coordinate: Cell): boolean {
        return this.startCell !== undefined && this.coordinatesAreTheSame(this.startCell, coordinate)
    }

    isFinish(coordinate: Cell): boolean {
        return this.finishCell !== undefined && this.coordinatesAreTheSame(this.finishCell, coordinate)
    }

    coordinatesAreTheSame(left: Cell, right: Cell): boolean {
        return left[0] === right[0] && left[1] === right[1]
    }

    isWall(cell: Cell): boolean {
        return this.boolMatrix[cell[0]][cell[1]] === true
    }

    setFinish(newFinish: Cell): void {
        if (!this.hasCoordinate(newFinish)) {
            throw new Error(`Invalid coordinate: ${newFinish.toString()}`)
        }

        if (this.isWall(newFinish) || this.isStart(newFinish)) {
            return
        }

        this.finishCell = newFinish
        this.clearWaves()
    }

    hasCoordinate(coordinate: Cell): boolean {
        return this.boolMatrix[coordinate[0]] !== undefined
            && this.boolMatrix[coordinate[0]][coordinate[1]] !== undefined
    }

    getStart(): Cell {
        return this.startCell
    }

    getFinish(): Cell {
        return this.finishCell
    }

    getArray(): Matrix {
        return this.boolMatrix
    }

    isCellAvailableForMove = (cell: Cell): boolean => {
        return this.hasCoordinate(cell) && !this.isWall(cell)
    }

    setWaveStep(wave: Cell[], step: number): void {
        wave.forEach((cell: Cell) => this.boolMatrix[cell[0]][cell[1]] = step)
    }

    clearWaves(): void {
        const toInitialState = (cell) => cell && !Number.isInteger(cell)
        this.boolMatrix = this.boolMatrix.map(row => row.map(toInitialState))
    }

    isWaveStep(cellValue: boolean | number): boolean {
        return Number.isInteger(cellValue)
    }

    getWidth(): number {
        return this.boolMatrix[0].length
    }

    getHeight(): number {
        return this.boolMatrix.length
    }
}