<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto">

    <!-- ── Hero header ────────────────────────────────────────────────────── -->
    <div class="card bg-gradient-to-br from-primary-700 to-indigo-600 border-0 text-white">
      <div class="text-center py-2">
        <div class="text-3xl mb-1">🌟</div>
        <h1 class="text-xl font-extrabold tracking-tight">Self Progress Chart</h1>
        <p class="text-primary-200 text-sm mt-0.5">Step towards Sampoornatha</p>
      </div>
    </div>

    <!-- ── User info card ─────────────────────────────────────────────────── -->
    <div class="card">
      <div class="flex items-stretch divide-x divide-primary-100">
        <div class="flex-1 flex flex-col items-center gap-1 px-2 py-1">
          <svg class="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <span class="text-xs text-gray-400 font-medium">Name</span>
          <span class="font-bold text-gray-800 text-sm text-center">{{ user?.displayName || '—' }}</span>
        </div>
        <div class="flex-1 flex flex-col items-center gap-1 px-2 py-1">
          <svg class="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="text-xs text-gray-400 font-medium">Centre / Pathashala</span>
          <span class="font-bold text-gray-800 text-sm text-center">{{ user?.centreName || '—' }}</span>
        </div>
        <div class="flex-1 flex flex-col items-center gap-1 px-2 py-1">
          <svg class="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="text-xs text-gray-400 font-medium">Date</span>
          <span class="font-bold text-gray-800 text-sm">{{ todayFormatted }}</span>
        </div>
      </div>
    </div>

    <!-- ── Summary stats ──────────────────────────────────────────────────── -->
    <div class="space-y-3">
      <!-- Yoga Target -->
      <button class="card flex items-center gap-4 w-full text-left" @click="showTargetPicker = true">
        <div class="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-xl flex-shrink-0">🎯</div>
        <div class="flex-1">
          <div class="font-semibold text-gray-700">Yoga Target</div>
          <div class="text-xs text-gray-400">Tap to change your target level</div>
        </div>
        <div class="flex items-center gap-1 text-2xl font-extrabold text-primary-700">
          {{ selectedYogaTarget.hours }} {{ selectedYogaTarget.label }}
          <span class="text-primary-400 text-base">▼</span>
        </div>
      </button>

      <!-- Yoga Target picker sheet -->
      <Teleport to="body">
        <Transition name="sheet">
          <div v-if="showTargetPicker" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="showTargetPicker = false">
            <div class="bg-white w-full rounded-t-3xl p-6 safe-area-bottom max-w-lg mx-auto">
              <h3 class="font-bold text-gray-800 mb-4">Choose Yoga target</h3>
              <div class="space-y-2 max-h-[60vh] overflow-y-auto">
                <button
                  v-for="t in yogaTargets"
                  :key="t.hours"
                  @click="selectYogaTarget(t.hours)"
                  class="w-full flex items-center justify-between px-4 py-3 rounded-xl border"
                  :class="t.hours === yogaTargetHours ? 'border-primary-400 bg-primary-50' : 'border-gray-100'"
                >
                  <span class="font-semibold text-gray-700">{{ t.label }}</span>
                  <span class="text-sm text-gray-400">{{ t.hours }} hours</span>
                </button>
              </div>
              <button class="btn-primary w-full mt-4" @click="showTargetPicker = false">Done</button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Yoga Achieved -->
      <div class="card flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-xl flex-shrink-0">🏳️</div>
        <div class="flex-1">
          <div class="font-semibold text-gray-700">Yoga Achieved</div>
          <div class="text-xs text-gray-400">Total yoga hours practiced so far</div>
        </div>
        <div class="text-2xl font-extrabold text-primary-700">{{ stats.totalYogaHours }}</div>
      </div>

      <!-- Total Points -->
      <div class="card flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">⭐</div>
        <div class="flex-1">
          <div class="font-semibold text-gray-700">Total Points</div>
          <div class="text-xs text-gray-400">Cumulative across all days</div>
        </div>
        <div class="text-2xl font-extrabold text-amber-600">
          {{ stats.totalPoints }} <span class="text-base font-bold">({{ targetPercent }}%)</span>
        </div>
      </div>

      <!-- Current Streak -->
      <div class="card flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">🔥</div>
        <div class="flex-1">
          <div class="font-semibold text-gray-700">Current Streak</div>
          <div class="text-xs text-gray-400">Consecutive days</div>
        </div>
        <div class="text-2xl font-extrabold text-orange-600">{{ stats.currentStreak }}</div>
      </div>
    </div>

    <!-- ── Progress chart ─────────────────────────────────────────────────── -->
    <div class="card overflow-hidden">
      <div class="flex items-center justify-between mb-3">
        <h2>Your Progress</h2>
        <!-- Category filter -->
        <select
          v-model="selectedCategory"
          class="text-xs font-semibold text-primary-700 bg-primary-50 border-0 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="total">Total</option>
          <option value="gyan">Gyan</option>
          <option value="yog">Yog</option>
          <option value="dharana">Dharana</option>
          <option value="seva">Seva</option>
        </select>
      </div>

      <!-- Period filter -->
      <div class="flex gap-1 bg-primary-50 p-1 rounded-xl mb-4">
        <button
          v-for="f in filters"
          :key="f.value"
          @click="activeFilter = f.value"
          class="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150"
          :class="activeFilter === f.value ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-400'"
        >{{ f.label }}</button>
      </div>

      <div v-if="chartData.length === 0" class="text-center py-10 text-gray-300">
        <div class="text-5xl mb-2">🌟</div>
        <p class="text-sm">No entries yet — start your daily practice!</p>
      </div>

      <div v-else class="overflow-x-auto -mx-4 px-4">
        <svg
          :width="svgW"
          height="160"
          :viewBox="`0 0 ${svgW} 160`"
          class="block"
          style="min-width: 100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line v-for="(yp, i) in gridYs" :key="i" :x1="yLabelW" :y1="yp" :x2="svgW - 4" :y2="yp" stroke="#ede9fe" stroke-width="1"/>
          <text v-for="(lbl, i) in yLabels" :key="'y'+i" :x="yLabelW - 4" :y="gridYs[i] + 3" text-anchor="end" font-size="8" fill="#a78bfa">{{ lbl }}</text>
          <g v-for="(item, i) in chartData" :key="item.date">
            <rect :x="barX(i)" :y="barY(item.value)" :width="barW" :height="bH(item.value)" :fill="item.value > 0 ? 'url(#barGrad)' : '#f5f3ff'" rx="3"/>
            <text v-if="item.value > 0" :x="barX(i) + barW / 2" :y="barY(item.value) - 2" text-anchor="middle" font-size="7" fill="#7c3aed" font-weight="600">{{ item.value }}</text>
            <text :x="barX(i) + barW / 2" y="157" text-anchor="middle" font-size="8" fill="#9ca3af">{{ shortDate(item.date) }}</text>
          </g>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a78bfa"/>
              <stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <!-- ── Today's summary ────────────────────────────────────────────────── -->
    <div class="card">
      <div class="flex items-center justify-between mb-3">
        <h2>Today's Check-in</h2>
        <button @click="router.push('/chart')" class="text-sm font-semibold text-primary-600">
          {{ todayEntry ? 'Edit →' : 'Fill in →' }}
        </button>
      </div>
      <div v-if="todayEntry">
        <div class="flex items-center justify-between py-2 border-b border-primary-50">
          <span class="text-sm font-medium text-gray-600">Points Today</span>
          <span class="font-extrabold text-primary-700 text-lg">{{ todayEntry.totalPoints }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3 mt-3">
          <div v-for="cat in todayCats" :key="cat.label" class="bg-primary-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span class="text-base">{{ cat.icon }}</span>
            <div>
              <div class="text-xs text-gray-400 font-medium">{{ cat.label }}</div>
              <div class="text-sm font-bold text-primary-700">{{ cat.pts }} pts</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-6 text-gray-400">
        <div class="text-4xl mb-2">📋</div>
        <p class="text-sm">No entry for today yet</p>
        <button @click="router.push('/chart')" class="mt-3 btn-primary text-sm py-2.5 px-6">Start Daily Check-in</button>
      </div>
    </div>

    <!-- ── Feedback ────────────────────────────────────────────────────────── -->
    <FeedbackButton />

    <!-- ── Footer ──────────────────────────────────────────────────────────── -->
    <footer class="text-center text-xs text-gray-400 pt-2 pb-4">
      <p>Designed &amp; Developed by Brahma Kumaris - Chennai.&nbsp;&nbsp;Copyrights {{ currentYear }}</p>
      <p class="mt-1">
        <a href="https://www.brahmakumaris.com" target="_blank" rel="noopener" class="text-primary-500 font-medium">brahmakumaris.com</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChecklistStore } from '@/stores/checklist'
import FeedbackButton from '@/components/FeedbackButton.vue'
import type { ChartFilter, ChartCategory } from '@/types'

const router    = useRouter()
const auth      = useAuthStore()
const store     = useChecklistStore()

const user  = computed(() => auth.user)
const stats = computed(() => store.stats)
const todayEntry = computed(() => store.todayEntry)

const todayFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

// ── Yoga target ────────────────────────────────────────────────────────────────

const YOGA_TARGET_KEY = 'spc_yoga_target_hours'
const yogaTargets = [
  { label: 'Starter',  hours: 108 },
  { label: 'Regular',  hours: 208 },
  { label: 'Bronze',   hours: 308 },
  { label: 'Silver',   hours: 408 },
  { label: 'Gold',     hours: 508 },
  { label: 'Diamond',  hours: 708 },
  { label: 'Platinum', hours: 1008 },
]

const showTargetPicker = ref(false)
const yogaTargetHours  = ref(Number(localStorage.getItem(YOGA_TARGET_KEY)) || yogaTargets[4].hours)

const selectedYogaTarget = computed(() =>
  yogaTargets.find(t => t.hours === yogaTargetHours.value) ?? yogaTargets[4]
)

function selectYogaTarget(hours: number) {
  yogaTargetHours.value = hours
  localStorage.setItem(YOGA_TARGET_KEY, String(hours))
  showTargetPicker.value = false
}

const targetPercent = computed(() => {
  const maxPossible = stats.value.totalDays * 50
  if (!maxPossible) return 0
  return Math.round((stats.value.totalPoints * 100) / maxPossible)
})

// ── Today cats breakdown ──────────────────────────────────────────────────────

const todayCats = computed(() => {
  const e = todayEntry.value
  if (!e) return []
  const gyan = (e.gyanMurali ? e.gyanMuraliStars : 0) + (e.gyanRevision ? 5 : 0)
  const yog  = (e.yogAmritvela ? e.yogAmritvelaStars * 2 : 0) +
               Math.floor(e.yogExtraHours * 10) +
               (e.yogTrafficControl ? e.yogTrafficStars : 0)
  const dhar = (e.dharanaMorningPledge ? 5 : 0) + (e.dharanaNightCheck ? e.dharanaNightStars : 0)
  const seva = e.sevaDone ? e.sevaStars : 0
  return [
    { label: 'Gyan',    icon: '📖', pts: gyan },
    { label: 'Yog',     icon: '🧘', pts: yog  },
    { label: 'Dharana', icon: '⭐', pts: dhar  },
    { label: 'Seva',    icon: '🤝', pts: seva  },
  ]
})

// ── Chart ─────────────────────────────────────────────────────────────────────

const filters = [
  { label: '7D',    value: '7d'    as ChartFilter },
  { label: '30D',   value: '30d'   as ChartFilter },
  { label: 'Month', value: 'month' as ChartFilter },
  { label: 'All',   value: 'all'   as ChartFilter },
]
const activeFilter     = ref<ChartFilter>('7d')
const selectedCategory = ref<ChartCategory>('total')

const chartData = computed(() => store.getDailyData(activeFilter.value, selectedCategory.value))
const maxVal    = computed(() => Math.max(...chartData.value.map(d => d.value), 1))

const yLabelW = 22
const topPad  = 8
const chartH  = 120
const xPad    = 4

const barStep = computed(() => {
  const n = chartData.value.length
  if (!n) return 40
  return Math.max(16, Math.min(56, Math.floor(300 / n)))
})
const barW    = computed(() => Math.max(6, barStep.value - 6))
const barXOff = computed(() => Math.floor((barStep.value - barW.value) / 2))
const svgW    = computed(() => yLabelW + chartData.value.length * barStep.value + xPad)

const barX = (i: number) => yLabelW + i * barStep.value + barXOff.value
const bH   = (v: number) => v > 0 ? Math.max(4, Math.round((v / maxVal.value) * chartH)) : 2
const barY = (v: number) => topPad + chartH - bH(v)

const gridYs = computed(() => [topPad, topPad + chartH / 2, topPad + chartH])
const yLabels = computed(() => [maxVal.value, Math.round(maxVal.value / 2), 0])

const shortDate = (date: string) => {
  const d = new Date(date + 'T00:00:00')
  if (activeFilter.value === '7d') return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

onMounted(async () => { await store.loadAllEntries() })

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.2s, transform 0.25s; }
.sheet-enter-from, .sheet-leave-to       { opacity: 0; transform: translateY(100%); }
</style>
