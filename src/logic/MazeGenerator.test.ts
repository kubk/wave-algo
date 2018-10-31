import { Maze } from './Maze';
import { MazeGenerator } from './MazeGenerator';

describe('generate', () => {
  const mazeGenerator = new MazeGenerator();
  const maze = mazeGenerator.generate(8, 10);

  expect(maze).toBeInstanceOf(Maze);

  it('generated maze has start and finish', () => {
    expect(maze.getStart()).toBeTruthy();
    expect(maze.getFinish()).toBeTruthy();
  });

  it('width and height are correct', () => {
    expect(maze.getHeight()).toEqual(8);
    expect(maze.getWidth()).toEqual(10);
  });

  it('generated maze has at least one empty cell and at least one wall', () => {
    let hasEmptyCell = false;
    let hasWall = false;

    for (let i = 0; i < maze.getHeight(); i++) {
      for (let j = 0; j < maze.getWidth(); j++) {
        if (hasEmptyCell && hasWall) {
          break;
        }
        if (maze.isCellAvailableForMove([i, j])) {
          hasEmptyCell = true;
        }
        if (maze.isWall([i, j])) {
          hasWall = true;
        }
      }
    }

    expect(hasEmptyCell).toBeTruthy();
    expect(hasWall).toBeTruthy();
  });
});
