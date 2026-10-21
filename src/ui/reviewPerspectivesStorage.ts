import { REVIEW_PERSPECTIVES } from '../review/perspectives'

const STORAGE_KEY = 'diffx-review-perspectives'

export function loadPerspectives(storage: Pick<Storage, 'getItem'> = localStorage): string[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return REVIEW_PERSPECTIVES.filter((p) => parsed.includes(p.id)).map((p) => p.id)
  } catch {
    return []
  }
}

export function savePerspectives(ids: string[], storage: Pick<Storage, 'setItem'> = localStorage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {}
}
