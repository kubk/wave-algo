import { Maze } from './Maze';

describe('Maze', () => {
  it('can be constructed without start and finish', () => {
    const maze = new Maze([[false, false, false], [false, true, false], [false, false, false]]);

    expect(maze.getFinish()).toBeFalsy();
    expect(maze.getStart()).toBeFalsy();
  });

  const start: [number, number] = [0, 0];
  const finish: [number, number] = [2, 2];

  const maze = new Maze(
    [[false, false, false], [false, true, false], [false, false, false]],
    start,
    finish
  );

  it('can be constructed with start and finish', () => {
    expect(maze).toBeInstanceOf(Maze);
    expect(maze.isStart(start)).toBeTruthy();
    expect(maze.isFinish(finish)).toBeTruthy();
    expect(maze.isFinish(start)).toBeFalsy();
  });

  it('allows to change start and finish', () => {
    const newStart: [number, number] = [1, 0];
    const newFinish: [number, number] = [1, 2];

    maze.setStart(newStart);
    maze.setFinish(newFinish);

    expect(maze.isStart(start)).toBeFalsy();
    expect(maze.isStart(newStart)).toBeTruthy();
    expect(maze.isFinish(finish)).toBeFalsy();
    expect(maze.isFinish(newFinish)).toBeTruthy();
  });

  it('does not change start/finish if given cell is wall', () => {
    const start = maze.getStart();
    expect(maze.isWall([1, 1])).toBeTruthy();
    maze.setStart([1, 1]);
    expect(maze.isStart(start));
  });
});
