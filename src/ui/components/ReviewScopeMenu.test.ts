import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ReviewScopeMenu, perspectiveSummary, toggleChecked, orderedIds } from './ReviewScopeMenu'

const three = [
  { id: 'a', label: 'A', instructions: '' },
  { id: 'b', label: 'B', instructions: '' },
  { id: 'c', label: 'C', instructions: '' },
]
const four = [...three, { id: 'd', label: 'D', instructions: '' }]

describe('perspectiveSummary', () => {
  it('says 기본 for none', () => {
    expect(perspectiveSummary([])).toBe('기본')
  })

  it('shows the only perspective by name even when it is all of them', () => {
    expect(perspectiveSummary(['convention'])).toBe('컨벤션과 하네스')
  })

  it('joins two names and counts from three', () => {
    expect(perspectiveSummary(['a', 'b'], four)).toBe('A, B')
    expect(perspectiveSummary(['a', 'b', 'c'], four)).toBe('A 외 2개')
  })

  it('says 모두 only when three or more are defined and all are picked', () => {
    expect(perspectiveSummary(['a', 'b', 'c'], three)).toBe('관점 3개 모두')
  })
})

describe('toggleChecked', () => {
  it('adds an unchecked id and removes a checked one', () => {
    expect(toggleChecked(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggleChecked(['a', 'b'], 'a')).toEqual(['b'])
  })
})

describe('orderedIds', () => {
  it('keeps only defined ids in the defined order', () => {
    expect(orderedIds(['c', 'x', 'a'], four)).toEqual(['a', 'c'])
    expect(orderedIds([], four)).toEqual([])
  })
})

describe('ReviewScopeMenu', () => {
  it('renders the split button with the summary under the label and the menu closed', () => {
    const html = renderToStaticMarkup(createElement(ReviewScopeMenu, { selected: ['convention'], onApply: () => {}, onRun: () => {}, disabled: false }))
    expect(html).toContain('전체 리뷰')
    expect(html).toContain('컨벤션과 하네스')
    expect(html).toContain('▴')
    expect(html).not.toContain('review-scope-menu')
  })

  it('marks the caret button as opening a dialog it controls', () => {
    const html = renderToStaticMarkup(createElement(ReviewScopeMenu, { selected: [], onApply: () => {}, onRun: () => {}, disabled: false }))
    expect(html).toContain('aria-haspopup="dialog"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toMatch(/aria-controls="[^"]+"/)
  })
})
