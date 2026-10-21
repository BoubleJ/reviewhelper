import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { QuestionCard } from './ReviewPanel'

describe('QuestionCard', () => {
  it('shows the selected code location and keeps the code folded', () => {
    const html = renderToStaticMarkup(createElement(QuestionCard, {
      kind: 'question',
      question: '왜?',
      selection: { path: 'src/cart.ts', side: 'additions', startLine: 12, endLine: 13, code: 'const total = 1' },
    }))
    expect(html).toContain('src/cart.ts:12-13 · 선택한 코드')
    expect(html).toContain('<details class="review-question-selection">')
    expect(html).toContain('const total = 1')
    expect(html).toContain('왜?')
  })

  it('lists the perspectives of a review', () => {
    const html = renderToStaticMarkup(createElement(QuestionCard, { kind: 'review', question: null, perspectives: ['convention'], excluded: ['a.ts', 'b.ts'] }))
    expect(html).toContain('컨벤션과 하네스 · 제외한 파일 2개를 빼고 리뷰')
  })

  it('keeps the meta line empty for a review without perspectives or excluded files', () => {
    const html = renderToStaticMarkup(createElement(QuestionCard, { kind: 'review', question: null }))
    expect(html).not.toContain('review-panel-meta')
  })

  it('renders no selection block without a selection', () => {
    const html = renderToStaticMarkup(createElement(QuestionCard, { kind: 'question', question: '왜?' }))
    expect(html).not.toContain('review-question-selection')
  })
})
