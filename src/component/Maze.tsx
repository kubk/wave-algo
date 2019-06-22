import React, { Component } from 'react';
import { Maze as MazeModel, Coordinate } from '../logic/Maze';
import { WaveColorGenerator } from '../logic/WaveColorGenerator';
import classNames from 'classnames';

interface Props {
  maze: MazeModel;
  backtrace: Coordinate[];
  onCellClick: (event: any, coordinate: Coordinate) => void;
  waveColorGenerator: WaveColorGenerator;
}

export class Maze extends Component<Props> {
  render() {
    const { maze, backtrace, onCellClick, waveColorGenerator } = this.props;
    return (
      <table className="table">
        <tbody>
          {maze.toArray().map((row, rowIndex) => (
            <tr key={rowIndex} className="row">
              {row.map((cell, columnIndex) => (
                <td
                  style={{
                    backgroundColor: maze.isWaveStep(cell)
                      ? waveColorGenerator.generate(cell)
                      : undefined
                  }}
                  key={columnIndex}
                  onClick={e => onCellClick(e, [rowIndex, columnIndex])}
                  onContextMenu={e => onCellClick(e, [rowIndex, columnIndex])}
                  className={classNames({
                    cell: true,
                    wall: maze.isWall([rowIndex, columnIndex]),
                    start: maze.isStart([rowIndex, columnIndex]),
                    finish: maze.isFinish([rowIndex, columnIndex]),
                    backtrace: maze.isBacktrace(backtrace, [rowIndex, columnIndex]),
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
