interface Rectangle {
  getWidth(): number;
  getHeight(): number;
}

export class WaveColorGenerator {
  waveColorDiff: number;

  constructor(rectangle: Rectangle) {
    this.waveColorDiff = (255 / rectangle.getWidth() / rectangle.getHeight()) * 4;
  }

  generate(step: number): string {
    const r = this.getColor(175, step);
    const g = this.getColor(238, step);
    const b = this.getColor(255, step);

    return `rgb(${r}, ${g}, ${b})`;
  }

  getColor(initial: number, step: number): number {
    return Math.floor(initial - step * this.waveColorDiff);
  }
}
