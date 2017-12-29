// @flow

import uniqBy from 'lodash.uniqby'
import { Maze } from './Maze'
import type { Cell } from './Maze';

export type Waves = Array<Cell[]>

export type WavePropagationResult = { waves: Waves, isFinishFound: boolean }

export class WaveAlgorithm {
    propagateWave(maze: Maze): WavePropagationResult {
        const waves = [], visited = [], queue = [[maze.getStart()]]

        const notVisited = currentCell =>
            !visited.find(cell => maze.coordinatesAreTheSame(cell, currentCell))

        let isFinishFound = false

        while (queue.length) {
            const queued = queue.shift()
            visited.push(...queued)

            const availableForMove = queued.reduce((availableForMove: Cell[], currentCell: Cell) => {
                const nextAvailableCells = this.getNeighbors(currentCell).filter(maze.isCellAvailableForMove)
                return availableForMove.concat(nextAvailableCells)
            }, [])

            const uniqCells = uniqBy(availableForMove, (cell) => `${cell[0]}${cell[1]}`)
            const withoutVisited = uniqCells.filter(notVisited)

            if (withoutVisited.length) {
                queue.push(withoutVisited)
                waves.push(withoutVisited)
            }

            if (withoutVisited.find(cell => maze.isFinish(cell))) {
                isFinishFound = true
                break
            }
        }

        return { waves, isFinishFound }
    }

    /**
     * @private
     */
    getNeighbors(cell: Cell): Cell[] {
        return [
            [cell[0] - 1, cell[1]],
            [cell[0] + 1, cell[1]],
            [cell[0], cell[1] - 1],
            [cell[0], cell[1] + 1],
        ]
    }

    generateBacktrace(waves: Waves, finishCell: Cell): Cell[] {
        const backtrace = []
        let fromCell = finishCell

        for (let i = waves.length - 1; i > 0; i--) {
            const next = waves[i - 1].find(toCell => this.isPreviousWave(fromCell, toCell))

            if (!next) {
                throw new Error('Backtrace is invalid')
            }

            backtrace.push(next)
            fromCell = next
        }

        return backtrace
    }

    /**
     * @private
     */
    isPreviousWave(fromCell: Cell, toCell: Cell): boolean {
        return toCell[0] + 1 === fromCell[0] && toCell[1] === fromCell[1]
            || toCell[0] === fromCell[0] && toCell[1] + 1 === fromCell[1]
            || toCell[0] - 1 === fromCell[0] && toCell[1] === fromCell[1]
            || toCell[0] === fromCell[0] && toCell[1] - 1 === fromCell[1]
    }
}
