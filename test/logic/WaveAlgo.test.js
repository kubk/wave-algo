import { Maze } from '../../src/logic/Maze'
import { WaveAlgorithm } from '../../src/logic/WaveAlgorithm'

const expectEqualIgnoreOrder = (left, right) => expect(left.sort()).toEqual(right.sort())

describe('WaveAlgo', () => {
    const waveAlgorithm = new WaveAlgorithm();

    it('propogates wave ignoring walls', () => {
        const maze = new Maze([
            [false, false, false, false],
            [false, true, false, false],
            [false, false, false, false],
            [true, true, true, true],
        ],
            [0, 0],
            [2, 3],
        )

        const { waves, isFinishFound } = waveAlgorithm.propagateWave(maze)

        expect(isFinishFound).toBeTruthy()
        expect(waves.length).toEqual(5)

        expectEqualIgnoreOrder(waves[0], [[1, 0], [0, 1]])
        expectEqualIgnoreOrder(waves[1], [[2, 0], [0, 2]])
        expectEqualIgnoreOrder(waves[2], [[0, 3], [2, 1], [1, 2]])
        expectEqualIgnoreOrder(waves[3], [[2, 2], [1, 3]])
        expectEqualIgnoreOrder(waves[4], [[2, 3]])
    })

    it('propogates wave', () => {
        const maze = new Maze([
            [false, false],
            [false, false],
        ],
            [0, 0],
            [1, 1]
        )

        const { waves, isFinishFound } = waveAlgorithm.propagateWave(maze)

        expect(isFinishFound).toBeTruthy()
        expect(waves.length).toEqual(2)

        expectEqualIgnoreOrder(waves[0], [[0, 1], [1, 0]])
        expectEqualIgnoreOrder(waves[1], [[1, 1]])
    })

    it('propogates wave when finish is not found', () => {
        const maze = new Maze([
            [false, false, true, false],
            [false, false, true, false],
            [false, false, true, false],
        ],
            [0, 0],
            [2, 3]
        )

        const { waves, isFinishFound } = waveAlgorithm.propagateWave(maze)

        expect(isFinishFound).toBeFalsy()
        expect(waves.length).toEqual(3)
    })

    it('can generate backtrace', () => {
        const waves = [
            [[1, 0], [0, 1]],
            [[2, 0], [0, 2]],
            [[0, 3], [2, 1], [1, 2]],
            [[2, 2], [1, 3]],
            [[2, 3]],
        ]

        const backtrace = waveAlgorithm.generateBacktrace(waves, [2, 3])

        expect(backtrace.length).toEqual(4)
        expect(backtrace[0]).toEqual([2, 2])
        expect(backtrace[1]).toEqual([2, 1])
        expect(backtrace[2]).toEqual([2, 0])
        expect(backtrace[3]).toEqual([1, 0])
    })
})
