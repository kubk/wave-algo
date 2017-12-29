// @flow

import React from 'react'
import { Maze as MazeLogic } from '../logic/Maze'
import type { Cell } from '../logic/Maze'
import classNames from 'classnames'
import WaveColorGenerator from '../logic/WaveColorGenerator';

type MazeProps = {
    maze: MazeLogic,
    backtrace: Cell[],
    onCellClick: Function,
    waveColorGenerator: WaveColorGenerator
}

export default function Maze({ maze, backtrace, onCellClick, waveColorGenerator }: MazeProps) {
    return <table className='board'>
        <tbody>{maze.getArray().map((row, rowIndex) =>
            <tr key={rowIndex}>{row.map((cell, columnIndex) =>
                <td
                    style={maze.isWaveStep(cell) ? {backgroundColor: waveColorGenerator.generate(cell)} : null}
                    key={columnIndex}
                    onClick={(e) => onCellClick(e, [rowIndex, columnIndex])}
                    onContextMenu={(e) => onCellClick(e, [rowIndex, columnIndex])}
                    className={classNames({
                        'square': true,
                        'wall': maze.isWall([rowIndex, columnIndex]),
                        'start': maze.isStart([rowIndex, columnIndex]),
                        'finish': maze.isFinish([rowIndex, columnIndex]),
                        'backtrace': displayAsBacktrace(maze, backtrace, [rowIndex, columnIndex]),
                        'wave': maze.isWaveStep(cell),
                    })}
                >{maze.isWaveStep(cell) ? cell : ''}</td>
            )}</tr>
        )}</tbody>
    </table>
}

function displayAsBacktrace(maze: Maze, backtrace: Cell[], cell: Cell): boolean {
   return !! backtrace.find(backtraceCell => maze.coordinatesAreTheSame(backtraceCell, cell))
}
