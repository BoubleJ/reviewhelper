import { useEffect, useId, useRef, useState } from 'react'
import { REVIEW_PERSPECTIVES, type ReviewPerspective } from '../../review/perspectives'

export function perspectiveLabels(ids: string[], all: ReviewPerspective[] = REVIEW_PERSPECTIVES): string[] {
  return all.filter((p) => ids.includes(p.id)).map((p) => p.label)
}

export function toggleChecked(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
}

export function orderedIds(ids: string[], all: ReviewPerspective[] = REVIEW_PERSPECTIVES): string[] {
  return all.filter((p) => ids.includes(p.id)).map((p) => p.id)
}

export function perspectiveSummary(ids: string[], all: ReviewPerspective[] = REVIEW_PERSPECTIVES): string {
  const labels = perspectiveLabels(ids, all)
  if (labels.length === 0) return '기본'
  if (all.length >= 3 && labels.length === all.length) return `관점 ${labels.length}개 모두`
  if (labels.length <= 2) return labels.join(', ')
  return `${labels[0]} 외 ${labels.length - 1}개`
}

interface ReviewScopeMenuProps {
  selected: string[]
  onApply: (ids: string[]) => void
  onRun: () => void
  disabled: boolean
}

export function ReviewScopeMenu({ selected, onApply, onRun, disabled }: ReviewScopeMenuProps) {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState<string[]>(selected)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLInputElement>('input')?.focus()
    const onMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      caretRef.current?.focus()
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const toggleOpen = () => {
    if (!open) setChecked(selected)
    setOpen(!open)
  }

  const toggle = (id: string) => {
    setChecked((prev) => toggleChecked(prev, id))
  }

  const apply = () => {
    onApply(orderedIds(checked))
    setOpen(false)
  }

  return (
    <div className="review-scope" ref={rootRef}>
      {open && (
        <div className="review-scope-menu" id={menuId} ref={menuRef} role="dialog" aria-label="리뷰 관점 선택">
          {REVIEW_PERSPECTIVES.map((p) => (
            <label key={p.id} className="review-scope-item">
              <input type="checkbox" checked={checked.includes(p.id)} onChange={() => toggle(p.id)} />
              {p.label}
            </label>
          ))}
          <div className="review-scope-foot">
            <button className="btn btn-sm" onClick={() => setOpen(false)}>취소</button>
            <button className="btn btn-primary btn-sm" onClick={apply}>적용</button>
          </div>
        </div>
      )}
      <button className="btn btn-sm review-scope-run" onClick={onRun} disabled={disabled || open}>
        <span>전체 리뷰</span>
        <span className="review-scope-sub">{perspectiveSummary(selected)}</span>
      </button>
      <button
        ref={caretRef}
        className={`btn btn-sm review-scope-caret${open ? ' btn-active' : ''}`}
        onClick={toggleOpen}
        disabled={disabled}
        title="리뷰 관점 선택"
        aria-label="리뷰 관점 선택"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={menuId}
      >
        ▴
      </button>
    </div>
  )
}
