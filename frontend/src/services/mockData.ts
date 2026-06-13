import type { DailyEntry, User } from '@/types'

export const MOCK_USER: User = {
  uid:         'mock-001',
  email:       'bkvivek@example.com',
  displayName: 'BK Vivek',
  photoURL:    null,
  centreName:  'Chennai Shantidham',
}

const DHARANA_AIMS = [
  'Win Over Anger', 'Remain in Silence', 'Practice Tolerance',
  'Stay in Soul Consciousness', 'Be a Master', 'Maintain Sweetness',
]

function calcPoints(e: Partial<DailyEntry>): number {
  let pts = 0
  if (e.gyanMurali)          pts += e.gyanMuraliStars ?? 0
  if (e.gyanRevision)        pts += 5
  if (e.yogAmritvela)        pts += (e.yogAmritvelaStars ?? 0) * 2
  pts += Math.floor((e.yogExtraHours ?? 0) * 10)
  if (e.yogTrafficControl)   pts += e.yogTrafficStars ?? 0
  if (e.dharanaMorningPledge) pts += 5
  if (e.dharanaNightCheck)   pts += e.dharanaNightStars ?? 0
  if (e.sevaDone)            pts += e.sevaStars ?? 0
  return pts
}

function mockEntry(date: string, seed: number): DailyEntry {
  const s = (n: number) => ((seed * 7 + n * 13) % 5) + 1
  const b = (n: number) => ((seed + n) % 3) !== 0

  const e: DailyEntry = {
    date,
    gyanMurali:           b(1),
    gyanMuraliStars:      b(1) ? s(1) : 0,
    gyanRevision:         b(2),
    yogAmritvela:         b(3),
    yogAmritvelaStars:    b(3) ? s(3) : 0,
    yogExtraHours:        b(4) ? (seed % 3) * 0.5 : 0,
    yogTrafficControl:    b(5),
    yogTrafficStars:      b(5) ? s(5) : 0,
    dharanaAim:           DHARANA_AIMS[seed % DHARANA_AIMS.length],
    dharanaMorningPledge: b(6),
    dharanaNightCheck:    b(7),
    dharanaNightStars:    b(7) ? s(7) : 0,
    sevaDone:             b(8),
    sevaStars:            b(8) ? s(8) : 0,
    totalPoints:          0,
    remarks:              seed % 4 === 0 ? 'Good session today, felt very peaceful.' : '',
    updatedAt:            new Date(),
  }
  e.totalPoints = calcPoints(e)
  return e
}

const OVERRIDES_KEY = 'spc_mock_overrides'

export function generateMockEntries(): Map<string, DailyEntry> {
  const map     = new Map<string, DailyEntry>()
  const raw     = localStorage.getItem(OVERRIDES_KEY)
  const overrides: Record<string, DailyEntry> = raw ? JSON.parse(raw) : {}
  const today   = new Date()

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = localDateStr(d)
    if (i % 7 === 6) continue  // skip some days for realism

    if (overrides[dateStr]) {
      map.set(dateStr, { ...overrides[dateStr], updatedAt: new Date(overrides[dateStr].updatedAt) })
    } else {
      map.set(dateStr, mockEntry(dateStr, i))
    }
  }
  return map
}

export function saveMockOverride(date: string, entry: DailyEntry): void {
  const raw      = localStorage.getItem(OVERRIDES_KEY)
  const existing = raw ? JSON.parse(raw) : {}
  existing[date] = entry
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing))
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export { calcPoints }
