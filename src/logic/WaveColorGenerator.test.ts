import { WaveColorGenerator } from './WaveColorGenerator';
import Color from 'color';

describe('WaveColorGenerator', () => {
  const rectangle = {
    getWidth: () => 10,
    getHeight: () => 10
  };

  const waveColorGenerator = new WaveColorGenerator(rectangle);

  it('generates darker color for each step', () => {
    const colorStep1 = Color(waveColorGenerator.generate(1));
    const colorStep2 = Color(waveColorGenerator.generate(2));

    expect(colorStep1.rgbNumber()).toBeGreaterThan(colorStep2.rgbNumber());

    const colorStep3 = Color(waveColorGenerator.generate(3));

    expect(colorStep2.rgbNumber()).toBeGreaterThan(colorStep3.rgbNumber());
  });

  it('generates the same color for the same step', () => {
    expect(waveColorGenerator.generate(1)).toEqual(waveColorGenerator.generate(1));
    expect(waveColorGenerator.generate(5)).toEqual(waveColorGenerator.generate(5));
  });
});
