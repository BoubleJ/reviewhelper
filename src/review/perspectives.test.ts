import { describe, it, expect } from 'vitest'
import { REVIEW_PERSPECTIVES, normalizePerspectives, resolvePerspectives } from './perspectives'

describe('REVIEW_PERSPECTIVES', () => {
  it('defines the convention perspective with the six instruction items', () => {
    const p = REVIEW_PERSPECTIVES.find((x) => x.id === 'convention')!
    expect(p.label).toBe('컨벤션과 하네스')
    expect(p.instructions).toContain('AGENTS.md')
    expect(p.instructions).toContain('CLAUDE.md')
    expect(p.instructions).toContain('.claude/skills/*/SKILL.md')
    expect(p.instructions).toContain('저장소 바깥은 보지 않')
    expect(p.instructions).toContain('어긋나는지는 확인하지 않')
    expect(p.instructions).toContain('lint 규칙')
    expect(p.instructions).toContain('공통 모듈')
    expect(p.instructions).toContain('삼항연산자')
    expect(p.instructions).toContain('camelCase')
    expect(p.instructions).toContain('해당 없음')
    expect(p.instructions).toContain('###')
  })
})

describe('normalizePerspectives', () => {
  it('returns an empty list for undefined', () => {
    expect(normalizePerspectives(undefined)).toEqual([])
  })

  it('returns null for a non string array or an unknown id', () => {
    expect(normalizePerspectives('convention')).toBeNull()
    expect(normalizePerspectives([1])).toBeNull()
    expect(normalizePerspectives(['nope'])).toBeNull()
  })

  it('drops duplicates and keeps the defined order', () => {
    expect(normalizePerspectives(['convention', 'convention'])).toEqual(['convention'])
  })
})

describe('resolvePerspectives', () => {
  it('maps ids to definitions and skips unknown ids', () => {
    expect(resolvePerspectives(['nope', 'convention']).map((p) => p.id)).toEqual(['convention'])
  })
})
