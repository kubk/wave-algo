// @flow

import React from 'react'
import { default as MazeView } from './Maze'
import { Maze } from '../logic/Maze'
import type { Cell } from '../logic/Maze'
import type { Waves } from '../logic/WaveAlgorithm'
import WaveColorGenerator from '../logic/WaveColorGenerator'
import { WaveAlgorithm } from '../logic/WaveAlgorithm'
import MazeGenerator from '../logic/MazeGenerator'

type AppState = {
    maze: Maze,
    backtrace: Cell[]
}

export default class App extends React.Component<{}, AppState> {
    timeoutIds = []
    waveAlgorithm = new WaveAlgorithm()
    mazeGenerator = new MazeGenerator()

    state = {
        maze: this.mazeGenerator.generate(),
        backtrace: [],
    }

    handleClick = (event: Event, coordinate: Cell) => {
        event.preventDefault()
        this.interruptAnimation()

        const { maze } = this.state

        if (this.isRightClick(event)) {
            maze.setFinish(coordinate)
        } else {
            maze.setStart(coordinate)
        }

        this.setState({ maze, backtrace: [] })
    }

    isRightClick(event: any): boolean {
        return event.nativeEvent.which === 3
    }

    interruptAnimation = () => {
        this.timeoutIds.forEach(clearTimeout)
    }

    /**
     * Wraps setTimeout for saving timeoutId
     */
    setTimeout = (...args: any) => {
        this.timeoutIds.push(setTimeout(...args))
    }

    runWaveAlgo = () => {
        this.clearWaves()

        const { maze } = this.state
        const { waves, isFinishFound } = this.waveAlgorithm.propagateWave(maze)

        const animateBacktrace = () => {
            const command = (isFinishFound)
                ? () => this.setState({ backtrace: this.waveAlgorithm.generateBacktrace(waves, maze.getFinish()) })
                : () => alert('Cannot find finish')

            this.setTimeout(command, 500)
        }

        this.animateWavePropagation(maze, waves)
            .then(animateBacktrace)
            .catch(error => console.log(error))
    }

    animateWavePropagation(maze: Maze, waves: Waves): Promise<*> {
        return new Promise(resolve => {
            for (let i = 0; i < waves.length - 1; i++) {
                this.setTimeout(() => {
                    maze.setWaveStep(waves[i], i + 1)
                    this.setState({ maze })
                    if (i === waves.length - 2) resolve()
                }, 200 * i)
            }
        })
    }

    generateNewMaze = () => {
        this.interruptAnimation()
        this.setState({ maze: this.mazeGenerator.generate(), backtrace: [] })
    }

    clearWaves = () => {
        this.interruptAnimation()
        const { maze } = this.state
        maze.clearWaves()
        this.setState({ maze, backtrace: [] })
    }

    render() {
        return (
            <div>
                <MazeView {...this.state} onCellClick={this.handleClick} waveColorGenerator={new WaveColorGenerator(this.state.maze)}/>
                <button onClick={this.runWaveAlgo}>Run wave algorithm</button>
                <button onClick={this.generateNewMaze}>Generate new maze</button>
                <button onClick={this.clearWaves}>Clear waves</button>
            </div>
        )
    }
}
