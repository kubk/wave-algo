import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './component/App';
import './css/index.scss';
import { WaveAlgorithm } from './logic/WaveAlgorithm';
import { MazeGenerator } from './logic/MazeGenerator';

const waveAlgorithm = new WaveAlgorithm();
const mazeGenerator = new MazeGenerator();

ReactDOM.render(
  <App waveAlgorithm={waveAlgorithm} mazeGenerator={mazeGenerator} />,
  document.getElementById('root')
);
