// @flow

import { Maze } from './Maze'
import type { Cell, Matrix } from './Maze'

export default class MazeGenerator {
    generate(rows: number = 12, columns :number = 22): Maze {
        if (rows < 2 || columns < 2) {
            throw new Error('Invalid maze params')
        }

        const maze = new Maze(this.generateBoolMatrix(rows, columns))

        // Pick the first 3 columns
        maze.setStart(this.getRandomEmptyCell(maze, 0, 3))
        // Pick the last 3 columns
        maze.setFinish(this.getRandomEmptyCell(maze, columns - 4, columns - 1))

        return maze
    }

    /**
     * @private
     */
    generateBoolMatrix(rows: number, columns: number): Matrix {
        const wallOrEmpty = (): boolean => Math.random() > 0.7

        return [...Array(rows)].map(() => [...Array(columns)].map(wallOrEmpty))
    }

    /**
     * @private
     */
    getRandomEmptyCell(maze: Maze, columnFrom: number, columnTo: number): Cell {
        const randomRow = Math.floor(Math.random() * maze.getHeight())
        const randomColumn = Math.floor(Math.random() * (columnTo - columnFrom + 1)) + columnFrom

        return maze.isWall([randomRow, randomColumn])
            ? this.getRandomEmptyCell(maze, columnFrom, columnTo)
            : [randomRow, randomColumn]
    }
}