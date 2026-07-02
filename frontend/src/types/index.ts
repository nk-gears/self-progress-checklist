export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  centreName: string | null
  joinedAt: string | null  // ISO date string from server created_at
}

export interface DailyEntry {
  date: string  // YYYY-MM-DD

  // 1. Gyan
  gyanMurali: boolean
  gyanMuraliStars: number   // 0–5
  gyanRevision: boolean

  // 2. Yog
  yogAmritvela: boolean
  yogAmritvelaStars: number // 0–5
  yogExtraHours: number     // 0–24
  yogTrafficControl: boolean
  yogTrafficStars: number   // 0–5

  // 3. Dharana
  dharanaAim: string
  dharanaMorningPledge: boolean
  dharanaNightCheck: boolean
  dharanaNightStars: number // 0–5

  // 4. Seva
  sevaDone: boolean
  sevaStars: number         // 0–5

  totalPoints: number
  remarks: string
  updatedAt: Date
}

export interface EntryStats {
  totalPoints: number
  totalDays: number
  currentStreak: number
  longestStreak: number
  avgPointsPerDay: number
  amritvelaCount: number
  totalYogaHours: number
}

export type ChartFilter   = '7d' | '30d' | 'month' | 'all'
export type ChartCategory = 'total' | 'gyan' | 'yog' | 'dharana' | 'seva'

// Max points per day (no extra yoga)
export const MAX_BASE_POINTS = 40
// Points breakdown: Gyan(5+5) + Yog(10+5) + Dharana(5+5) + Seva(5) = 40
