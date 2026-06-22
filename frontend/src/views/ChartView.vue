<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto">

    <!-- ── Hero header ────────────────────────────────────────────────────── -->
    <div class="card bg-gradient-to-br from-primary-700 to-indigo-600 border-0 text-white">
      <div class="text-center py-2">
        <div class="w-14 h-14 mx-auto mb-1.5 rounded-full bg-white shadow-md flex items-center justify-center">
          <img src="/supreme.png" class="w-11 h-11" alt="" />
        </div>
        <h1 class="text-xl font-extrabold tracking-tight">{{ t('chart.title') }}</h1>
        <p class="text-primary-200 text-sm mt-0.5">{{ t('chart.tagline') }}</p>
      </div>
    </div>

    <!-- ── Date navigation ───────────────────────────────────────────────── -->
    <div class="card text-center py-3">
      <div class="flex items-center justify-center gap-2 text-sm font-medium text-primary-700">
        <button @click="shiftDate(-1)" class="w-7 h-7 flex items-center justify-center rounded-full text-primary-500 hover:bg-primary-50 flex-shrink-0">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <svg class="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <button @click="showPicker = true" class="font-bold text-primary-800">{{ formattedDate }}</button>
        <button @click="showPicker = true" class="text-primary-400">▼</button>
        <button @click="shiftDate(1)" :disabled="selectedDate >= todayStr"
          class="w-7 h-7 flex items-center justify-center rounded-full text-primary-500 hover:bg-primary-50 flex-shrink-0 disabled:opacity-30 disabled:hover:bg-transparent">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Date picker sheet ──────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showPicker" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="showPicker = false">
          <div class="bg-white w-full rounded-t-3xl p-6 safe-area-bottom">
            <h3 class="font-bold text-gray-800 mb-4">{{ t('chart.chooseDate') }}</h3>
            <input type="date" :value="selectedDate" :max="todayStr"
              class="input-field text-center text-lg font-semibold" @change="onDateInput"/>
            <button class="btn-primary w-full mt-4" @click="showPicker = false">{{ t('common.done') }}</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── User info strip ───────────────────────────────────────────────── -->
    <div class="flex gap-3 items-center">
      <div class="flex items-center gap-2 flex-1 bg-white rounded-xl px-3 py-2 border border-primary-100">
        <svg class="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <div>
          <div class="text-xs text-gray-400">{{ t('common.name') }}</div>
          <div class="text-sm font-bold text-gray-800">{{ user?.displayName || '—' }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-1 bg-white rounded-xl px-3 py-2 border border-primary-100">
        <svg class="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/>
        </svg>
        <div>
          <div class="text-xs text-gray-400">{{ t('chart.centre') }}</div>
          <div class="text-sm font-bold text-gray-800 truncate">{{ user?.centreName || '—' }}</div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ 1. GYAN ════════════════════════════════════════ -->
    <div class="card space-y-3 bg-emerald-50 border-2 border-emerald-200">
      <div class="flex items-center gap-2 pb-2 border-b-2 border-emerald-200">
        <span class="text-lg">📖</span>
        <span class="text-emerald-700 font-bold text-sm bg-emerald-100 w-6 h-6 rounded-full flex items-center justify-center">1</span>
        <h2 class="text-emerald-700">{{ t('chart.gyan') }}</h2>
      </div>

      <!-- Murali at Centre -->
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <div class="font-semibold text-gray-800 text-sm">{{ t('chart.muraliAtCentre') }}</div>
            <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.muraliAtCentreDesc') }}</div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="form.gyanMurali = !form.gyanMurali; form.gyanMuraliStars = form.gyanMurali ? 1 : 0"
              class="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              :class="form.gyanMurali ? 'bg-emerald-600' : 'bg-gray-300'"
            >
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                :class="form.gyanMurali ? 'translate-x-6' : 'translate-x-0'" />
            </button>
          </div>
        </div>
        <div v-if="form.gyanMurali" class="flex justify-between items-center pl-1">
          <StarRating v-model="form.gyanMuraliStars" activeClass="text-emerald-500" />
          <span class="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-lg">{{ form.gyanMuraliStars }} pts</span>
        </div>
      </div>

      <!-- Murali Revision -->
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <div class="font-semibold text-gray-800 text-sm">{{ t('chart.muraliRevision') }}</div>
          <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.muraliRevisionDesc') }}</div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span v-if="form.gyanRevision" class="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-lg">5 {{ t('common.pts') }}</span>
          <button @click="form.gyanRevision = !form.gyanRevision"
            class="relative w-12 h-6 rounded-full transition-colors duration-200"
            :class="form.gyanRevision ? 'bg-emerald-600' : 'bg-gray-300'"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
              :class="form.gyanRevision ? 'translate-x-6' : 'translate-x-0'" />
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ 2. YOG ════════════════════════════════════════ -->
    <div class="card space-y-3 bg-blue-50 border-2 border-blue-200">
      <div class="flex items-center gap-2 pb-2 border-b-2 border-blue-200">
        <span class="text-lg">🧘</span>
        <span class="text-blue-700 font-bold text-sm bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center">2</span>
        <h2 class="text-blue-700">{{ t('chart.yog') }}</h2>
      </div>

      <!-- Amritvela -->
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <div class="font-semibold text-gray-800 text-sm">{{ t('chart.amritvela') }}</div>
            <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.amritvelaDesc') }}</div>
          </div>
          <button @click="form.yogAmritvela = !form.yogAmritvela; form.yogAmritvelaStars = form.yogAmritvela ? 1 : 0"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            :class="form.yogAmritvela ? 'bg-emerald-600' : 'bg-gray-300'"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
              :class="form.yogAmritvela ? 'translate-x-6' : 'translate-x-0'" />
          </button>
        </div>
        <div v-if="form.yogAmritvela" class="flex justify-between items-center pl-1">
          <StarRating v-model="form.yogAmritvelaStars" activeClass="text-blue-500" />
          <span class="text-xs font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-lg">{{ form.yogAmritvelaStars * 2 }} / 10 {{ t('common.pts') }}</span>
        </div>
      </div>

      <!-- Extra Yoga -->
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <div class="font-semibold text-gray-800 text-sm">{{ t('chart.extraYoga') }} <span class="text-gray-400 font-normal">{{ t('chart.extraYogaPts') }}</span></div>
          <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.extraYogaDesc') }}</div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span v-if="form.yogExtraHours > 0" class="text-xs font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-lg">{{ Math.floor(form.yogExtraHours * 10) }} {{ t('common.pts') }}</span>
          <select v-model="form.yogExtraHours"
            class="text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option v-for="h in extraHourOptions" :key="h.value" :value="h.value">{{ h.label }}</option>
          </select>
        </div>
      </div>

      <!-- Traffic Control -->
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <div class="font-semibold text-gray-800 text-sm">{{ t('chart.trafficControl') }}</div>
            <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.trafficControlDesc') }}</div>
          </div>
          <button @click="form.yogTrafficControl = !form.yogTrafficControl; form.yogTrafficStars = form.yogTrafficControl ? 1 : 0"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            :class="form.yogTrafficControl ? 'bg-emerald-600' : 'bg-gray-300'"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
              :class="form.yogTrafficControl ? 'translate-x-6' : 'translate-x-0'" />
          </button>
        </div>
        <div v-if="form.yogTrafficControl" class="flex justify-between items-center pl-1">
          <StarRating v-model="form.yogTrafficStars" activeClass="text-blue-500" />
          <span class="text-xs font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-lg">{{ form.yogTrafficStars }} / 5 {{ t('common.pts') }}</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ 3. DHARANA ══════════════════════════════════════ -->
    <div class="card space-y-3 bg-violet-50 border-2 border-violet-200">
      <div class="flex items-center gap-2 pb-2 border-b-2 border-violet-200">
        <span class="text-lg">🎯</span>
        <span class="text-violet-700 font-bold text-sm bg-violet-100 w-6 h-6 rounded-full flex items-center justify-center">3</span>
        <h2 class="text-violet-700">{{ t('chart.dharana') }} <span class="text-gray-400 font-normal text-base">{{ t('chart.dharanaSubtitle') }}</span></h2>
      </div>

      <!-- Aim -->
      <div>
        <div class="font-semibold text-gray-800 text-sm mb-1.5">{{ t('chart.personalAim') }}</div>
        <div class="text-sm text-gray-600 mb-2">{{ t('chart.personalAimDesc') }}</div>
        <div class="flex gap-2">
          <select v-model="dharanaAimChoice"
            class="flex-1 input-field text-sm py-2.5"
          >
            <option value="">{{ t('chart.selectAim') }}</option>
            <option v-for="aim in DHARANA_AIMS" :key="aim" :value="aim">{{ aimLabel(aim) }}</option>
          </select>
        </div>
        <input v-if="dharanaAimChoice === 'Other…'" v-model="customAim" type="text"
          :placeholder="t('chart.describeAim')" maxlength="500"
          class="input-field text-sm mt-2" />
      </div>

      <!-- Morning Pledge -->
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <div class="font-semibold text-gray-800 text-sm">{{ t('chart.morningPledge') }}</div>
          <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.morningPledgeDesc') }}</div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span v-if="form.dharanaMorningPledge" class="text-xs font-bold text-violet-700 bg-white border border-violet-200 px-2 py-0.5 rounded-lg">5 {{ t('common.pts') }}</span>
          <button @click="form.dharanaMorningPledge = !form.dharanaMorningPledge"
            class="relative w-12 h-6 rounded-full transition-colors duration-200"
            :class="form.dharanaMorningPledge ? 'bg-emerald-600' : 'bg-gray-300'"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
              :class="form.dharanaMorningPledge ? 'translate-x-6' : 'translate-x-0'" />
          </button>
        </div>
      </div>

      <!-- Night Self-check -->
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <div class="font-semibold text-gray-800 text-sm">{{ t('chart.nightCheck') }}</div>
            <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.nightCheckDesc') }}</div>
          </div>
          <button @click="form.dharanaNightCheck = !form.dharanaNightCheck; form.dharanaNightStars = form.dharanaNightCheck ? 1 : 0"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            :class="form.dharanaNightCheck ? 'bg-emerald-600' : 'bg-gray-300'"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
              :class="form.dharanaNightCheck ? 'translate-x-6' : 'translate-x-0'" />
          </button>
        </div>
        <div v-if="form.dharanaNightCheck" class="flex justify-between items-center pl-1">
          <StarRating v-model="form.dharanaNightStars" activeClass="text-violet-500" />
          <span class="text-xs font-bold text-violet-700 bg-white border border-violet-200 px-2 py-0.5 rounded-lg">{{ form.dharanaNightStars }} / 5 {{ t('common.pts') }}</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ 4. SEVA ════════════════════════════════════════ -->
    <div class="card space-y-3 bg-orange-50 border-2 border-orange-200">
      <div class="flex items-center gap-2 pb-2 border-b-2 border-orange-200">
        <span class="text-lg">🤝</span>
        <span class="text-orange-700 font-bold text-sm bg-orange-100 w-6 h-6 rounded-full flex items-center justify-center">4</span>
        <h2 class="text-orange-700">{{ t('chart.seva') }}</h2>
      </div>

      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <div class="font-semibold text-gray-800 text-sm">{{ t('chart.sevaMin') }}</div>
            <div class="text-sm text-gray-600 mt-0.5">{{ t('chart.sevaMinDesc') }}</div>
          </div>
          <button @click="form.sevaDone = !form.sevaDone; form.sevaStars = form.sevaDone ? 1 : 0"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            :class="form.sevaDone ? 'bg-emerald-600' : 'bg-gray-300'"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
              :class="form.sevaDone ? 'translate-x-6' : 'translate-x-0'" />
          </button>
        </div>
        <div v-if="form.sevaDone" class="flex justify-between items-center pl-1">
          <StarRating v-model="form.sevaStars" activeClass="text-orange-500" />
          <span class="text-xs font-bold text-orange-700 bg-white border border-orange-200 px-2 py-0.5 rounded-lg">{{ form.sevaStars }} / 5 {{ t('common.pts') }}</span>
        </div>
      </div>
    </div>

    <!-- ── Remarks ─────────────────────────────────────────────────────── -->
    <div class="card">
      <h2 class="mb-1">{{ t('chart.remarks') }} <span class="text-gray-400 font-normal text-base">· {{ t('common.optional') }}</span></h2>
      <textarea v-model="form.remarks" :placeholder="t('chart.remarksPlaceholder')"
        class="input-field resize-none mt-2" rows="2" />
    </div>

    <!-- ── Points summary + Save ──────────────────────────────────────── -->
    <div class="card bg-gradient-to-r from-primary-600 to-indigo-600 border-0">
      <div class="flex items-center justify-between text-white">
        <div>
          <div class="text-sm font-medium opacity-80">{{ t('chart.totalPointsToday') }}</div>
          <div class="text-4xl font-extrabold">{{ currentPoints }}</div>
          <div class="text-xs opacity-70 mt-0.5">{{ t('chart.outOfBasePoints', { max: MAX_BASE_POINTS }) }}</div>
        </div>
        <div class="text-right">
          <div v-if="currentPoints === MAX_BASE_POINTS" class="text-amber-300 font-bold text-sm mb-1">{{ t('chart.perfectDay') }}</div>
          <div v-else-if="currentPoints >= MAX_BASE_POINTS * 0.8" class="text-amber-300 font-bold text-sm mb-1">{{ t('chart.excellentEffort') }}</div>
          <div v-else-if="currentPoints >= MAX_BASE_POINTS * 0.5" class="text-white/80 font-semibold text-sm mb-1">{{ t('chart.goodProgress') }}</div>
        </div>
      </div>
    </div>

    <div>
      <button @click="save" :disabled="saving" class="btn-primary w-full text-base py-4">
        <span v-if="saving">{{ t('common.saving') }}</span>
        <span v-else>{{ t('chart.saveEntry') }}</span>
      </button>
    </div>

    <!-- ── Feedback ────────────────────────────────────────────────────────── -->
    <div class="pb-6">
      <FeedbackButton />
    </div>
  </div>

  <!-- ── Toast ──────────────────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toastMsg"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 whitespace-nowrap"
      >
        <span>✅</span> {{ toastMsg }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useChecklistStore } from '@/stores/checklist'
import { calcPoints } from '@/services/mockData'
import StarRating from '@/components/StarRating.vue'
import FeedbackButton from '@/components/FeedbackButton.vue'
import { MAX_BASE_POINTS } from '@/types'

function localStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const DHARANA_AIMS = [
  'Win Over Anger', 'Control on Mobile Usage', 'Procrastination (Postponing Things)',
  'Comparing and Competing with Others', 'Seeing Weaknesses in Others (Paradarshan)', 'Lack of Punctuality in Daily Routine',
  'Making Excuses for Mistake', 'I Am Always Right" Attitude', 'Other…',
]

// Stored aim values stay in English for backward-compatible saved entries;
// only the displayed label is localized.
const AIM_KEY_MAP: Record<string, string> = {
  'Win Over Anger': 'winOverAnger',
  'Control on Mobile Usage': 'controlMobile',
  'Procrastination (Postponing Things)': 'procrastination',
  'Comparing and Competing with Others': 'comparing',
  'Seeing Weaknesses in Others (Paradarshan)': 'seeingWeaknesses',
  'Lack of Punctuality in Daily Routine': 'punctuality',
  'Making Excuses for Mistake': 'excuses',
  'I Am Always Right" Attitude': 'alwaysRight',
  'Other…': 'other',
}

const { t } = useI18n()
const aimLabel = (aim: string) => t(`chart.aims.${AIM_KEY_MAP[aim] ?? 'other'}`)

const extraHourOptions = computed(() => [
  { label: `0 ${t('common.hours')}`,   value: 0 },
  { label: '0.5 hr',                   value: 0.5 },
  { label: `1 ${t('common.hours')}`,   value: 1 },
  { label: '1.5 hr',                   value: 1.5 },
  { label: `2 ${t('common.hours')}`,   value: 2 },
  { label: `3 ${t('common.hours')}`,   value: 3 },
  { label: `4 ${t('common.hours')}`,   value: 4 },
])

const auth  = useAuthStore()
const store = useChecklistStore()

const user       = computed(() => auth.user)
const todayStr   = localStr(new Date())
const selectedDate = ref(todayStr)
const showPicker   = ref(false)
const saving       = ref(false)
const toastMsg     = ref('')

const formattedDate = computed(() => {
  const d = new Date(selectedDate.value + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const form = reactive({
  gyanMurali: false, gyanMuraliStars: 0,
  gyanRevision: false,
  yogAmritvela: false, yogAmritvelaStars: 0,
  yogExtraHours: 0,
  yogTrafficControl: false, yogTrafficStars: 0,
  dharanaAim: '',
  dharanaMorningPledge: false,
  dharanaNightCheck: false, dharanaNightStars: 0,
  sevaDone: false, sevaStars: 0,
  remarks: '',
})

const currentPoints = computed(() => calcPoints(form))

const dharanaAimChoice = ref('')
const customAim        = ref('')

const setDharanaAim = (value: string) => {
  if (!value) {
    dharanaAimChoice.value = ''
    customAim.value = ''
  } else if (DHARANA_AIMS.includes(value) && value !== 'Other…') {
    dharanaAimChoice.value = value
    customAim.value = ''
  } else {
    dharanaAimChoice.value = 'Other…'
    customAim.value = value
  }
  form.dharanaAim = value
}

watch(dharanaAimChoice, (val) => {
  form.dharanaAim = val === 'Other…' ? customAim.value : val
})
watch(customAim, (val) => {
  if (dharanaAimChoice.value === 'Other…') form.dharanaAim = val
})

const loadForDate = () => {
  const e = store.getEntry(selectedDate.value)
  if (e) {
    Object.assign(form, {
      gyanMurali: e.gyanMurali, gyanMuraliStars: e.gyanMuraliStars,
      gyanRevision: e.gyanRevision,
      yogAmritvela: e.yogAmritvela, yogAmritvelaStars: e.yogAmritvelaStars,
      yogExtraHours: e.yogExtraHours,
      yogTrafficControl: e.yogTrafficControl, yogTrafficStars: e.yogTrafficStars,
      dharanaMorningPledge: e.dharanaMorningPledge,
      dharanaNightCheck: e.dharanaNightCheck, dharanaNightStars: e.dharanaNightStars,
      sevaDone: e.sevaDone, sevaStars: e.sevaStars,
      remarks: e.remarks,
    })
    setDharanaAim(e.dharanaAim)
  } else {
    Object.assign(form, {
      gyanMurali: false, gyanMuraliStars: 0, gyanRevision: false,
      yogAmritvela: false, yogAmritvelaStars: 0, yogExtraHours: 0,
      yogTrafficControl: false, yogTrafficStars: 0,
      dharanaMorningPledge: false,
      dharanaNightCheck: false, dharanaNightStars: 0,
      sevaDone: false, sevaStars: 0, remarks: '',
    })
    setDharanaAim('')
  }
}

watch(selectedDate, loadForDate)

const onDateInput = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  if (v) selectedDate.value = v
  showPicker.value = false
}

const shiftDate = (days: number) => {
  const d = new Date(selectedDate.value + 'T00:00:00')
  d.setDate(d.getDate() + days)
  const next = localStr(d)
  if (next <= todayStr) selectedDate.value = next
}

let toastTimer: ReturnType<typeof setTimeout> | null = null

const save = async () => {
  saving.value = true
  try {
    const pts = await store.saveEntry({ date: selectedDate.value, ...form })
    if (toastTimer) clearTimeout(toastTimer)
    toastMsg.value = t('chart.pointsSaved', { points: pts })
    toastTimer = setTimeout(() => { toastMsg.value = '' }, 3000)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await store.loadAllEntries()
  loadForDate()
})
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.2s, transform 0.25s; }
.sheet-enter-from, .sheet-leave-to       { opacity: 0; transform: translateY(100%); }
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.25s; }
.toast-enter-from, .toast-leave-to       { opacity: 0; transform: translateX(-50%) translateY(-12px); }
</style>
