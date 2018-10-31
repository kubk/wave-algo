import React, { Component } from 'react';
import { Maze as MazeModel, Cell } from '../logic/Maze';
import { WaveColorGenerator } from '../logic/WaveColorGenerator';
import classNames from 'classnames';

interface Props {
  maze: MazeModel;
  backtrace: Cell[];
  onCellClick: Function;
  waveColorGenerator: WaveColorGenerator;
}

export class Maze extends Component<Props> {
  isBacktrace(maze: MazeModel, backtrace: Cell[], cell: Cell): boolean {
    return !!backtrace.find(backtraceCell => maze.coordinatesAreTheSame(backtraceCell, cell));
  }

  render() {
    const { maze, backtrace, onCellClick, waveColorGenerator } = this.props;
    return (
      <table className="table">
        <tbody>
          {maze.toArray().map((row, rowIndex) => (
            <tr key={rowIndex} className="row">
              {row.map((cell, columnIndex) => (
                <td
                  style={
                    maze.isWaveStep(cell)
                      ? {
                          backgroundColor: waveColorGenerator.generate(cell as number)
                        }
                      : {}
                  }
                  key={columnIndex}
                  onClick={e => onCellClick(e, [rowIndex, columnIndex])}
                  onContextMenu={e => onCellClick(e, [rowIndex, columnIndex])}
                  className={classNames({
                    cell: true,
                    wall: maze.isWall([rowIndex, columnIndex]),
                    start: maze.isStart([rowIndex, columnIndex]),
                    finish: maze.isFinish([rowIndex, columnIndex]),
                    backtrace: this.isBacktrace(maze, backtrace, [rowIndex, columnIndex]),
                    wave: maze.isWaveStep(cell)
                  })}
                >
                  {maze.isWaveStep(cell) ? cell : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
