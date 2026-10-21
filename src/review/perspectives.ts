export interface ReviewPerspective {
  id: string
  label: string
  instructions: string
}

const CONVENTION_INSTRUCTIONS = [
  '기능 동작보다 컨벤션과 하네스(에이전트 지침, lint, 공통 상수와 타입) 관점으로 리뷰하세요.',
  '',
  '1. 에이전트 지침 준수: 저장소 루트와, 변경된 파일이 속한 폴더에서 루트까지 올라가는 경로에서 AGENTS.md, CLAUDE.md, agent.md, skill.md, .claude/skills/*/SKILL.md, .cursorrules 같은 에이전트 지침 파일을 `git ls-tree`와 Read로 찾으세요. 있으면 그 내용이 변경 코드에 지켜졌는지 확인하세요. 저장소 바깥은 보지 않습니다. 지침 파일이 없으면 없다고 쓰세요.',
  '2. lint 규칙 제안: eslint, biome, prettier, tsconfig 같은 설정이 있으면 어떤 규칙이 이미 켜져 있는지만 파악하세요. 변경 코드가 lint 규칙에 어긋나는지는 확인하지 않습니다. lint 위반은 커밋이나 푸시 단계에서 이미 걸러집니다. 이번 리뷰의 지적 사항 중 아직 켜져 있지 않은 lint 규칙으로 자동화할 수 있는 것을 규칙 이름과 함께 제안하세요.',
  '3. 공통 상수와 타입: 변경 코드의 상수, 문자열 리터럴, 타입이 공통 모듈로 빠질 수 있는지 확인하세요. 공통 모듈에 이미 있는 것을 다시 선언한 곳도 찾으세요.',
  '4. 컨벤션: 삼항연산자 중첩, 이름 표기법(camelCase, PascalCase, 상수 UPPER_CASE), import 순서, 옵셔널 체이닝, early return 같은 작성 방식이 저장소의 기존 코드와 일관되는지 확인하세요.',
  '5. 기능 버그보다 위 항목을 우선하세요. 기능 버그는 바로 눈에 띄는 것만 짧게 적으세요.',
  '6. 이 관점의 answer는 위 1번부터 4번 항목 순서대로 ### 소제목을 두고 쓰세요. 해당 없는 항목은 "해당 없음"으로 적으세요.',
].join('\n')

export const REVIEW_PERSPECTIVES: ReviewPerspective[] = [
  { id: 'convention', label: '컨벤션과 하네스', instructions: CONVENTION_INSTRUCTIONS },
]

export function normalizePerspectives(value: unknown): string[] | null {
  if (value === undefined) return []
  if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) return null
  if (!value.every((id) => REVIEW_PERSPECTIVES.some((p) => p.id === id))) return null
  return REVIEW_PERSPECTIVES.filter((p) => value.includes(p.id)).map((p) => p.id)
}

export function resolvePerspectives(ids: string[]): ReviewPerspective[] {
  return REVIEW_PERSPECTIVES.filter((p) => ids.includes(p.id))
}
