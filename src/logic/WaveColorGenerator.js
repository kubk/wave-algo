// @flow

import { Maze } from './Maze'

export default class WaveColorGenerator {
    waveColorDiff: number

    constructor(maze: Maze) {
        this.waveColorDiff = 255 / maze.getWidth() / maze.getHeight() * 4
    }

    generate(step: number): string {
        return `rgb(${this.getColor(175, step)}, ${this.getColor(238, step)}, ${this.getColor(255, step)})`
    }

    getColor(initial: number, step: number): number {
        return Math.floor(initial - step * this.waveColorDiff)
    }
}