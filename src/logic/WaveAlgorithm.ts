import uniqBy from 'lodash.uniqby';
import { Maze, Coordinate, Wave } from './Maze';

type WavePropagationResult = { waves: Wave[]; isFinishFound: boolean };

export class WaveAlgorithm {
  propagateWave(maze: Maze): WavePropagationResult {
    const visited: Coordinate[] = [];
    const waves: Coordinate[][] = [];
    const queue: Coordinate[][] = [[maze.getStart()]];

    const notVisited = (currentCell: Coordinate) => {
      return !visited.find(cell => maze.coordinatesAreTheSame(cell, currentCell));
    };

    let isFinishFound = false;
    while (queue.length) {
      const queued = queue.shift();
      if (!queued) {
        throw new Error('Invalid queue');
      }
      visited.push(...queued);

      const availableForMove = queued.reduce(
        (availableForMove: Coordinate[], currentCell: Coordinate) => {
          const nextAvailableCells = this.getNeighbors(currentCell).filter(
            maze.isAvailableForMove.bind(maze)
          );
          return availableForMove.concat(nextAvailableCells);
        },
        []
      );

      const uniqCells: Coordinate[] = uniqBy(
        availableForMove,
        (cell: Coordinate) => `${cell[0]}${cell[1]}`
      );
      const withoutVisited = uniqCells.filter(notVisited);

      if (withoutVisited.length) {
        queue.push(withoutVisited);
        waves.push(withoutVisited);
      }
      if (withoutVisited.find(cell => maze.isFinish(cell))) {
        isFinishFound = true;
        break;
      }
    }

    return { waves, isFinishFound };
  }

  private getNeighbors(coordinate: Coordinate): Coordinate[] {
    return [
      [coordinate[0] - 1, coordinate[1]],
      [coordinate[0] + 1, coordinate[1]],
      [coordinate[0], coordinate[1] - 1],
      [coordinate[0], coordinate[1] + 1]
    ];
  }

  generateBacktrace(waves: Wave[], finish: Coordinate): Coordinate[] {
    const backtrace = [];
    let fromCell = finish;
    for (let i = waves.length - 1; i > 0; i--) {
      const next = waves[i - 1].find(toCell => this.isPreviousWave(fromCell, toCell));
      if (!next) {
        throw new Error('Backtrace is invalid');
      }
      backtrace.push(next);
      fromCell = next;
    }
    return backtrace;
  }

  private isPreviousWave(from: Coordinate, to: Coordinate): boolean {
    return (
      (to[0] + 1 === from[0] && to[1] === from[1]) ||
      (to[0] === from[0] && to[1] + 1 === from[1]) ||
      (to[0] - 1 === from[0] && to[1] === from[1]) ||
      (to[0] === from[0] && to[1] - 1 === from[1])
    );
  }
}
