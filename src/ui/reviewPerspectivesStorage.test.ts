import { describe, it, expect } from 'vitest'
import { loadPerspectives, savePerspectives } from './reviewPerspectivesStorage'

function memoryStorage() {
  const data = new Map<string, string>()
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
}

describe('reviewPerspectivesStorage', () => {
  it('defaults to no perspectives', () => {
    expect(loadPerspectives(memoryStorage())).toEqual([])
  })

  it('round-trips the ids', () => {
    const s = memoryStorage()
    savePerspectives(['convention'], s)
    expect(loadPerspectives(s)).toEqual(['convention'])
  })

  it('drops unknown ids and broken values', () => {
    const s = memoryStorage()
    s.setItem('diffx-review-perspectives', JSON.stringify(['nope', 'convention']))
    expect(loadPerspectives(s)).toEqual(['convention'])
    s.setItem('diffx-review-perspectives', '{')
    expect(loadPerspectives(s)).toEqual([])
    s.setItem('diffx-review-perspectives', JSON.stringify({ a: 1 }))
    expect(loadPerspectives(s)).toEqual([])
  })
})
