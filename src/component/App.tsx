import React from 'react';
import { Maze as MazeView } from './Maze';
import { Cell, Maze as MazeModel } from '../logic/Maze';
import { Waves } from '../logic/WaveAlgorithm';
import { WaveColorGenerator } from '../logic/WaveColorGenerator';
import { WaveAlgorithm } from '../logic/WaveAlgorithm';
import { MazeGenerator } from '../logic/MazeGenerator';

interface Props {
  mazeGenerator: MazeGenerator;
  waveAlgorithm: WaveAlgorithm;
}

interface State {
  maze: MazeModel;
  backtrace: Cell[];
}

export class App extends React.Component<Props, State> {
  timeoutIds: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      maze: this.props.mazeGenerator.generate(),
      backtrace: []
    };
  }

  handleClick = (event: Event, coordinate: Cell) => {
    event.preventDefault();
    this.interruptAnimation();

    const { maze } = this.state;

    if (this.isRightClick(event)) {
      maze.setFinish(coordinate);
    } else {
      maze.setStart(coordinate);
    }

    this.setState({ maze, backtrace: [] });
  };

  isRightClick(event: any): boolean {
    return event.nativeEvent.which === 3;
  }

  interruptAnimation = () => {
    this.timeoutIds.forEach(clearTimeout);
  };

  /**
   * Wraps setTimeout for saving timeoutId
   */
  setTimeout = (callback: any, timeout: any) => {
    this.timeoutIds.push(setTimeout(callback, timeout));
  };

  runWaveAlgo = async () => {
    this.clearWaves();

    const { waveAlgorithm } = this.props;
    const { maze } = this.state;
    const { waves, isFinishFound } = waveAlgorithm.propagateWave(maze);

    await this.animateWavePropagation(maze, waves);

    if (isFinishFound) {
      this.setTimeout(() => {
        const backtrace = waveAlgorithm.generateBacktrace(waves, maze.getFinish());
        this.setState({ backtrace });
      }, 500);
    } else {
      this.setTimeout(() => alert('Cannot find finish'), 500);
    }
  };

  animateWavePropagation(maze: MazeModel, waves: Waves): Promise<void> {
    return new Promise(resolve => {
      for (let i = 0; i < waves.length - 1; i++) {
        this.setTimeout(() => {
          maze.setWaveStep(waves[i], i + 1);
          this.setState({ maze });
          if (i === waves.length - 2) {
            resolve();
          }
        }, 200 * i);
      }
    });
  }

  generateNewMaze = () => {
    this.interruptAnimation();
    const maze = this.props.mazeGenerator.generate();
    this.setState({ maze, backtrace: [] });
  };

  clearWaves = () => {
    this.interruptAnimation();
    const { maze } = this.state;
    maze.clearWaves();
    this.setState({ maze, backtrace: [] });
  };

  render() {
    return (
      <div className="maze">
        <MazeView
          {...this.state}
          onCellClick={this.handleClick}
          waveColorGenerator={new WaveColorGenerator(this.state.maze)}
        />
        <button className="maze-control" onClick={this.runWaveAlgo}>
          Run wave algorithm
        </button>
        <button className="maze-control" onClick={this.generateNewMaze}>
          Generate new maze
        </button>
        <button className="maze-control" onClick={this.clearWaves}>
          Clear waves
        </button>
      </div>
    );
  }
}
