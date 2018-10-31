import { Maze, Cell, Matrix } from './Maze';

export class MazeGenerator {
  generate(rows: number = 12, columns: number = 28): Maze {
    if (rows < 2 || columns < 2) {
      throw new Error('Invalid maze params');
    }
    const maze = new Maze(this.generateBoolMatrix(rows, columns));
    // Pick the first 3 columns
    maze.setStart(this.findRandomEmptyCell(maze, 0, 3));
    // Pick the last 3 columns
    maze.setFinish(this.findRandomEmptyCell(maze, columns - 4, columns - 1));

    return maze;
  }

  private generateBoolMatrix(rows: number, columns: number): Matrix {
    const wallOrEmpty = (): boolean => Math.random() > 0.77;

    return [...Array(rows)].map(() => [...Array(columns)].map(wallOrEmpty));
  }

  private findRandomEmptyCell(maze: Maze, columnFrom: number, columnTo: number): Cell {
    const randomRow = Math.floor(Math.random() * maze.getHeight());
    const randomColumn = Math.floor(Math.random() * (columnTo - columnFrom + 1)) + columnFrom;

    return maze.isWall([randomRow, randomColumn])
      ? this.findRandomEmptyCell(maze, columnFrom, columnTo)
      : [randomRow, randomColumn];
  }
}
