export type Coordinate = [number, number];
export type Wave = Coordinate[];
export type Cell = boolean | number;
export type Matrix = Cell[][];

export class Maze {
  private matrix: Matrix;
  private start?: Coordinate;
  private finish?: Coordinate;

  constructor(matrix: Matrix, start?: Coordinate, finish?: Coordinate) {
    this.matrix = matrix;
    if (start) {
      this.setStart(start);
    }
    if (finish) {
      this.setFinish(finish);
    }
  }

  setStart(newStart: Coordinate): void {
    if (!this.hasCoordinate(newStart)) {
      throw new Error(`Invalid coordinate`);
    }
    if (this.isWall(newStart) || this.isFinish(newStart)) {
      return;
    }
    this.start = newStart;
    this.clearWaves();
  }

  isStart(coordinate: Coordinate): boolean {
    return this.start !== undefined && this.coordinatesAreTheSame(this.start, coordinate);
  }

  isFinish(coordinate: Coordinate): boolean {
    return this.finish !== undefined && this.coordinatesAreTheSame(this.finish, coordinate);
  }

  coordinatesAreTheSame(left: Coordinate, right: Coordinate): boolean {
    return left[0] === right[0] && left[1] === right[1];
  }

  isWall(coordinate: Coordinate): boolean {
    return this.matrix[coordinate[0]][coordinate[1]] === true;
  }

  setFinish(newFinish: Coordinate): void {
    if (!this.hasCoordinate(newFinish)) {
      throw new Error(`Invalid coordinate: ${newFinish.toString()}`);
    }
    if (this.isWall(newFinish) || this.isStart(newFinish)) {
      return;
    }
    this.finish = newFinish;
    this.clearWaves();
  }

  hasCoordinate(coordinate: Coordinate): boolean {
    return (
      this.matrix[coordinate[0]] !== undefined &&
      this.matrix[coordinate[0]][coordinate[1]] !== undefined
    );
  }

  getStart(): Coordinate {
    if (!this.start) {
      throw new Error('Start is not set');
    }
    return this.start;
  }

  getFinish(): Coordinate {
    if (!this.finish) {
      throw new Error('Finish is not set');
    }
    return this.finish;
  }

  toArray(): Matrix {
    return this.matrix;
  }

  isAvailableForMove(coordinate: Coordinate): boolean {
    return this.hasCoordinate(coordinate) && !this.isWall(coordinate);
  }

  setWaveStep(wave: Wave, step: number): void {
    wave.forEach(coordinate => {
      this.matrix[coordinate[0]][coordinate[1]] = step;
    });
  }

  clearWaves(): void {
    const toInitialState = (cell: Cell) => {
      return typeof cell === 'boolean' ? cell : !Number.isInteger(cell);
    };
    this.matrix = this.matrix.map(row => row.map(toInitialState));
  }

  isWaveStep(cell: Cell): cell is number {
    if (typeof cell === 'boolean') {
      return false;
    }
    return Number.isInteger(cell);
  }

  isBacktrace(backtrace: Coordinate[], cell: Coordinate): boolean {
    return !!backtrace.find(backtraceCell => this.coordinatesAreTheSame(backtraceCell, cell));
  }

  getWidth(): number {
    return this.matrix[0].length;
  }

  getHeight(): number {
    return this.matrix.length;
  }
}
