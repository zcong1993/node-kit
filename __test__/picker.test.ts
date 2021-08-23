import {
  ConsistentHashPicker,
  Crc32HashPicker,
  RandomPicker,
  RoundRobinPicker,
} from '../src/picker'
import { intRange, repeatCallSync } from './testUtils'

describe('RandomPicker', () => {
  let nodes = intRange(20)
  const rp = new RandomPicker(nodes)

  it('should works', () => {
    repeatCallSync(100, () => {
      expect(nodes.includes(rp.pick('aaa'))).toBeTruthy()
    })
  })

  it('setNodes', () => {
    nodes = intRange(10)
    rp.setNodes(nodes)
    repeatCallSync(100, () => {
      expect(nodes.includes(rp.pick('bbb'))).toBeTruthy()
    })
  })
})

describe('RoundRobinPicker', () => {
  let nodes = intRange(10)
  const rp = new RoundRobinPicker(nodes)

  it('should works', () => {
    for (let i = 0; i < 10; i++) {
      expect(rp.pick(`a-${i}`)).toBe(i)
    }

    // should reset to 0
    expect(rp.pick('aaa')).toBe(0)
  })

  it('setNodes', () => {
    nodes = intRange(5)
    rp.setNodes(nodes)
    // setNodes should reset index to 0
    for (let i = 0; i < 5; i++) {
      expect(rp.pick(`a-${i}`)).toBe(i)
    }

    // should reset to 0
    expect(rp.pick('aaa')).toBe(0)
  })
})

describe('Crc32HashPicker', () => {
  const nodes = intRange(20)
  const rp = new Crc32HashPicker(nodes)

  let picked: number

  it('should works', () => {
    repeatCallSync(100, () => {
      const cur = rp.pick('test')
      if (!picked) {
        picked = cur
      } else {
        expect(cur).toBe(picked)
      }
    })
  })
})

describe('ConsistentHashPicker', () => {
  const nodes = intRange(20)
  const rp = new ConsistentHashPicker(
    nodes.map((n) => ({
      id: `id-${n}`,
      node: n,
      weight: 100,
      vnodes: 50,
    }))
  )

  it('should works', () => {
    let picked: number

    repeatCallSync(100, () => {
      const cur = rp.pick('test')
      if (!picked) {
        picked = cur
      } else {
        expect(cur).toBe(picked)
      }
    })
  })

  it('setNodes', () => {
    rp.setNodes(
      intRange(10).map((n) => ({
        id: `id-${n}`,
        node: n,
      }))
    )

    repeatCallSync(100, () => {
      let picked: number

      repeatCallSync(100, () => {
        const cur = rp.pick('test')
        if (!picked) {
          picked = cur
        } else {
          expect(cur).toBe(picked)
        }
      })
    })
  })
})
