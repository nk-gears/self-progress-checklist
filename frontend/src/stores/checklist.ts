import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import { useDevModeStore } from './devMode'
import { generateMockEntries, saveMockOverride, calcPoints } from '@/services/mockData'
import type { DailyEntry, EntryStats, ChartFilter, ChartCategory } from '@/types'

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useChecklistStore = defineStore('checklist', () => {
  const entries = ref<Map<string, DailyEntry>>(new Map())
  const loading = ref(false)
  const loaded  = ref(false)

  // ── Load ───────────────────────────────────────────────────────────────────

  const loadAllEntries = async () => {
    if (loaded.value) return
    const dev = useDevModeStore()

    if (dev.isMock) {
      loading.value = true
      await new Promise(r => setTimeout(r, 300))
      entries.value = generateMockEntries()
      loaded.value  = true
      loading.value = false
      return
    }

    loading.value = true
    try {
      const { entries: rows } = await api.getEntries()
      rows.forEach(r => {
        entries.value.set(r.date, {
          ...r,
          updatedAt: new Date(r.updatedAt),
        })
      })
      loaded.value = true
    } catch (e) {
      console.error('[checklist] loadAllEntries failed:', e)
    } finally {
      loading.value = false
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  const saveEntry = async (entry: Omit<DailyEntry, 'totalPoints' | 'updatedAt'>) => {
    const totalPoints = calcPoints(entry)
    const full: DailyEntry = { ...entry, totalPoints, updatedAt: new Date() }
    const dev = useDevModeStore()

    if (dev.isMock) {
      await new Promise(r => setTimeout(r, 200))
      entries.value.set(entry.date, full)
      saveMockOverride(entry.date, full)
      return totalPoints
    }

    // Optimistic update
    entries.value.set(entry.date, full)
    api.saveEntry({ ...entry, totalPoints })
      .catch(e => console.error('[checklist] saveEntry failed:', e))
    return totalPoints
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  const getEntry = (date: string) => entries.value.get(date)

  const allSorted = computed(() =>
    Array.from(entries.value.values())
      .sort((a, b) => a.date.localeCompare(b.date)),
  )

  const recentEntries = computed(() =>
    Array.from(entries.value.values())
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30),
  )

  const stats = computed((): EntryStats => {
    const all = allSorted.value
    if (!all.length) {
      return { totalPoints: 0, totalDays: 0, currentStreak: 0, longestStreak: 0, avgPointsPerDay: 0, amritvelaCount: 0, totalYogaHours: 0 }
    }

    const totalPoints    = all.reduce((s, e) => s + e.totalPoints, 0)
    const totalDays      = all.length
    const avgPointsPerDay = Math.round(totalPoints / totalDays)
    const amritvelaCount = all.filter(e => e.yogAmritvela).length
    // Amritvela counts as a 1-hour session on top of any logged extra yoga hours
    const totalYogaHours = all.reduce((s, e) => s + (e.yogAmritvela ? 1 : 0) + e.yogExtraHours, 0)

    const _now      = new Date()
    const _yest     = new Date(); _yest.setDate(_yest.getDate() - 1)
    const today     = localDateStr(_now)
    const yesterday = localDateStr(_yest)

    let currentStreak = 0
    const lastDate = all[all.length - 1].date
    if (lastDate === today || lastDate === yesterday) {
      currentStreak = 1
      for (let i = all.length - 2; i >= 0; i--) {
        const gap = (new Date(all[i + 1].date).getTime() - new Date(all[i].date).getTime()) / 86_400_000
        if (gap === 1) currentStreak++
        else break
      }
    }

    let longestStreak = 1, temp = 1
    for (let i = 1; i < all.length; i++) {
      const gap = (new Date(all[i].date).getTime() - new Date(all[i - 1].date).getTime()) / 86_400_000
      temp = gap === 1 ? temp + 1 : 1
      longestStreak = Math.max(longestStreak, temp)
    }

    return { totalPoints, totalDays, currentStreak, longestStreak, avgPointsPerDay, amritvelaCount, totalYogaHours }
  })

  const getDailyData = (filter: ChartFilter, category: ChartCategory): { date: string; value: number }[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const getValue = (e: DailyEntry | undefined): number => {
      if (!e) return 0
      switch (category) {
        case 'gyan': {
          let p = 0
          if (e.gyanMurali)   p += e.gyanMuraliStars
          if (e.gyanRevision) p += 5
          return p
        }
        case 'yog': {
          let p = 0
          if (e.yogAmritvela)       p += e.yogAmritvelaStars * 2
          p += Math.floor(e.yogExtraHours * 10)
          if (e.yogTrafficControl)  p += e.yogTrafficStars
          return p
        }
        case 'dharana': {
          let p = 0
          if (e.dharanaMorningPledge) p += 5
          if (e.dharanaNightCheck)    p += e.dharanaNightStars
          return p
        }
        case 'seva':
          return e.sevaDone ? e.sevaStars : 0
        default:
          return e.totalPoints
      }
    }

    if (filter === 'all') {
      return allSorted.value.map(e => ({ date: e.date, value: getValue(e) }))
    }

    let days: number
    let startDate: Date

    if (filter === '7d') {
      days = 7; startDate = new Date(today); startDate.setDate(today.getDate() - 6)
    } else if (filter === '30d') {
      days = 30; startDate = new Date(today); startDate.setDate(today.getDate() - 29)
    } else {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      days = today.getDate()
    }

    return Array.from({ length: days }, (_, i) => {
      const d = new Date(startDate)
      d.setDate(startDate.getDate() + i)
      const date = localDateStr(d)
      return { date, value: getValue(entries.value.get(date)) }
    })
  }

  const todayEntry = computed(() => {
    const today = localDateStr(new Date())
    return entries.value.get(today) ?? null
  })

  return {
    entries, loading, loaded,
    loadAllEntries, saveEntry,
    getEntry, allSorted, recentEntries, stats, getDailyData, todayEntry,
  }
})
