<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto pb-8">

    <!-- ── Avatar + name ─────────────────────────────────────────────────── -->
    <div class="card flex flex-col items-center py-8 gap-2 relative" :class="profileBg">
      <button @click="showBgPicker = !showBgPicker"
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
        <span class="text-sm">🎨</span>
      </button>
      <div v-if="showBgPicker" class="absolute top-12 right-3 bg-white rounded-xl shadow-lg p-2 flex gap-2 z-10">
        <button v-for="c in bgColors" :key="c.value" @click="selectBg(c.value)"
          class="w-6 h-6 rounded-full border-2"
          :class="[c.swatch, profileBg === c.value ? 'border-primary-600' : 'border-white']"
        />
      </div>
      <div class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl shadow-md mb-2">🔆🔅</div>
      <h2 class="font-extrabold text-gray-800 text-2xl leading-tight">{{ user?.displayName || t('profile.bkMember') }}</h2>

      <input v-if="editingTagline" ref="taglineInput" v-model="taglineDraft"
        class="text-gray-600 text-base text-center border-b border-primary-300 focus:outline-none bg-transparent px-1"
        maxlength="80" @keyup.enter="saveTagline" @blur="saveTagline" />
      <button v-else @click="startEditTagline" class="text-gray-600 text-base flex items-center gap-1.5">
        {{ tagline }}
        <svg class="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </button>
    </div>

    <!-- ── Language ──────────────────────────────────────────────────────── -->
    <div class="card flex items-center justify-between">
      <h2>{{ t('common.language') }}</h2>
      <LanguageSwitcher />
    </div>

    <!-- ── My Details ─────────────────────────────────────────────────────── -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2>{{ t('profile.myDetails') }}</h2>
        <button v-if="!editing" @click="startEdit"
          class="flex items-center gap-1.5 text-sm font-semibold text-primary-600">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          {{ t('common.edit') }}
        </button>
      </div>

      <!-- View mode -->
      <div v-if="!editing" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <div class="text-xs text-gray-400 font-medium">{{ t('common.name') }}</div>
            <div class="font-bold text-gray-800">{{ user?.displayName || '—' }}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/>
            </svg>
          </div>
          <div>
            <div class="text-xs text-gray-400 font-medium">{{ t('common.centre') }}</div>
            <div class="font-bold text-gray-800">{{ user?.centreName || '—' }}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <div class="text-xs text-gray-400 font-medium">{{ t('profile.joinedOn') }}</div>
            <div class="font-bold text-gray-800">{{ joinedDate }}</div>
          </div>
        </div>
      </div>

      <!-- Edit mode -->
      <div v-else class="space-y-3">
        <div>
          <label class="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">{{ t('common.name') }}</label>
          <input ref="nameInput" v-model="editName" class="input-field" :placeholder="t('profile.namePlaceholder')" @keyup.enter="saveName"/>
        </div>
        <div>
          <label class="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">{{ t('common.centre') }}</label>
          <input v-model="editCentre" class="input-field" :placeholder="t('profile.centrePlaceholder')" @keyup.enter="saveName"/>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="cancelEdit" class="btn-secondary flex-1 py-3">{{ t('common.cancel') }}</button>
          <button @click="saveName" :disabled="saving" class="btn-primary flex-1 py-3">
            {{ saving ? t('common.saving') : t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Stats ─────────────────────────────────────────────────────────── -->
    <div class="card">
      <h2 class="mb-3">{{ t('profile.progressStats') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-primary-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-primary-700">{{ stats.totalDays }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">{{ t('profile.daysLogged') }}</div>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-amber-600">{{ stats.totalPoints }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">{{ t('profile.totalPoints') }}</div>
        </div>
        <div class="bg-orange-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-orange-600">🔥 {{ stats.currentStreak }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">{{ t('profile.currentStreak') }}</div>
        </div>
        <div class="bg-purple-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-purple-700">⭐ {{ stats.longestStreak }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">{{ t('profile.bestStreak') }}</div>
        </div>
        <div class="bg-blue-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-blue-700">🧘 {{ stats.totalYogaHours }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">{{ t('profile.yogaHours') }}</div>
        </div>
        <div class="bg-primary-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-primary-700">🌅 {{ stats.amritvelaCount }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">{{ t('profile.amritvelaDays') }}</div>
        </div>
      </div>
    </div>

    <!-- ── Sign out ───────────────────────────────────────────────────────── -->
    <button @click="showLogout = true"
      class="w-full py-3.5 rounded-2xl border-2 border-red-100 text-red-500 font-semibold hover:bg-red-50 active:scale-95 transition-all">
      {{ t('profile.signOut') }}
    </button>
  </div>

  <!-- ── Logout sheet ────────────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="showLogout" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="showLogout = false">
        <div class="bg-white w-full rounded-t-3xl p-6 safe-area-bottom">
          <h3 class="font-bold text-gray-800 text-lg mb-1">{{ t('profile.signOutConfirm') }}</h3>
          <p class="text-gray-400 text-sm mb-6">{{ t('profile.signOutNote') }}</p>
          <div class="flex gap-3">
            <button @click="showLogout = false" class="btn-secondary flex-1">{{ t('common.cancel') }}</button>
            <button @click="logout" class="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold active:scale-95 transition-all">{{ t('profile.signOut') }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useChecklistStore } from '@/stores/checklist'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t }   = useI18n()
const auth    = useAuthStore()
const store   = useChecklistStore()
const router  = useRouter()

const user    = computed(() => auth.user)
const stats   = computed(() => store.stats)

const joinedDate = computed(() => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))

// ── Avatar card background (editable, stored locally) ───────────────────────

const BG_KEY = 'spc_profile_card_bg'
const bgColors = [
  { value: 'bg-white',       swatch: 'bg-gray-100'    },
  { value: 'bg-primary-50',  swatch: 'bg-primary-200' },
  { value: 'bg-rose-50',     swatch: 'bg-rose-200'    },
  { value: 'bg-amber-50',    swatch: 'bg-amber-200'   },
  { value: 'bg-emerald-50',  swatch: 'bg-emerald-200' },
  { value: 'bg-sky-50',      swatch: 'bg-sky-200'     },
  { value: 'bg-violet-50',   swatch: 'bg-violet-200'  },
]
const profileBg   = ref(localStorage.getItem(BG_KEY) || 'bg-white')
const showBgPicker = ref(false)

const selectBg = (value: string) => {
  profileBg.value = value
  localStorage.setItem(BG_KEY, value)
  showBgPicker.value = false
}

// ── Tagline (editable, stored locally) ───────────────────────────────────────

const TAGLINE_KEY = 'spc_profile_tagline'
const customTagline  = ref(localStorage.getItem(TAGLINE_KEY) || '')
const tagline = computed(() => customTagline.value || t('profile.studentOfBaba'))

const editingTagline = ref(false)
const taglineDraft   = ref('')
const taglineInput   = ref<HTMLInputElement | null>(null)

const startEditTagline = async () => {
  taglineDraft.value   = tagline.value
  editingTagline.value = true
  await nextTick()
  taglineInput.value?.focus()
}

const saveTagline = () => {
  editingTagline.value = false
  const val = taglineDraft.value.trim()
  customTagline.value = val
  if (val) localStorage.setItem(TAGLINE_KEY, val)
  else localStorage.removeItem(TAGLINE_KEY)
}

// ── Edit ──────────────────────────────────────────────────────────────────────

const editing   = ref(false)
const editName  = ref('')
const editCentre = ref('')
const saving    = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)
const showLogout = ref(false)

const startEdit = async () => {
  editName.value   = user.value?.displayName || ''
  editCentre.value = user.value?.centreName || ''
  editing.value    = true
  await nextTick()
  nameInput.value?.focus()
}
const cancelEdit = () => { editing.value = false }

const saveName = async () => {
  if (!editName.value.trim()) return
  saving.value = true
  try {
    await auth.updateProfile(editName.value.trim(), editCentre.value.trim())
    editing.value = false
  } finally {
    saving.value = false
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────

const logout = async () => {
  await auth.logout()
  router.push('/login')
}

onMounted(async () => { await store.loadAllEntries() })
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.2s, transform 0.25s; }
.sheet-enter-from, .sheet-leave-to       { opacity: 0; transform: translateY(100%); }
</style>
