<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto pb-8">

    <!-- ── Avatar + name ─────────────────────────────────────────────────── -->
    <div class="card flex flex-col items-center py-8 gap-2">
      <div class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-5xl shadow-md mb-2">🌟</div>
      <h2 class="font-extrabold text-gray-800 text-2xl leading-tight">{{ user?.displayName || 'BK Member' }}</h2>
      <p class="text-gray-400 text-sm">A student of Baba 💜</p>
    </div>

    <!-- ── My Details ─────────────────────────────────────────────────────── -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2>My Details</h2>
        <button v-if="!editing" @click="startEdit"
          class="flex items-center gap-1.5 text-sm font-semibold text-primary-600">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit
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
            <div class="text-xs text-gray-400 font-medium">Name</div>
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
            <div class="text-xs text-gray-400 font-medium">Centre / Pathashala</div>
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
            <div class="text-xs text-gray-400 font-medium">Joined On</div>
            <div class="font-bold text-gray-800">{{ joinedDate }}</div>
          </div>
        </div>
      </div>

      <!-- Edit mode -->
      <div v-else class="space-y-3">
        <div>
          <label class="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Name</label>
          <input ref="nameInput" v-model="editName" class="input-field" placeholder="Your BK name" @keyup.enter="saveName"/>
        </div>
        <div>
          <label class="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Centre / Pathashala</label>
          <input v-model="editCentre" class="input-field" placeholder="e.g. Chennai Shantidham" @keyup.enter="saveName"/>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="cancelEdit" class="btn-secondary flex-1 py-3">Cancel</button>
          <button @click="saveName" :disabled="saving" class="btn-primary flex-1 py-3">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Stats ─────────────────────────────────────────────────────────── -->
    <div class="card">
      <h2 class="mb-3">My Progress Stats</h2>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-primary-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-primary-700">{{ stats.totalDays }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">Days Logged</div>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-amber-600">{{ stats.totalPoints }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">Total Points</div>
        </div>
        <div class="bg-orange-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-orange-600">🔥 {{ stats.currentStreak }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">Current Streak</div>
        </div>
        <div class="bg-purple-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-extrabold text-purple-700">⭐ {{ stats.longestStreak }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">Best Streak</div>
        </div>
        <div class="bg-primary-50 rounded-xl p-4 text-center col-span-2">
          <div class="text-2xl font-extrabold text-primary-700">🧘 {{ stats.amritvelaCount }}</div>
          <div class="text-xs text-gray-500 mt-1 font-medium">Amritvela Days</div>
        </div>
      </div>
    </div>

    <!-- ── Sign out ───────────────────────────────────────────────────────── -->
    <button @click="showLogout = true"
      class="w-full py-3.5 rounded-2xl border-2 border-red-100 text-red-500 font-semibold hover:bg-red-50 active:scale-95 transition-all">
      Sign Out
    </button>
  </div>

  <!-- ── Logout sheet ────────────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="showLogout" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="showLogout = false">
        <div class="bg-white w-full rounded-t-3xl p-6 safe-area-bottom">
          <h3 class="font-bold text-gray-800 text-lg mb-1">Sign out?</h3>
          <p class="text-gray-400 text-sm mb-6">Your progress data is safely stored on the server.</p>
          <div class="flex gap-3">
            <button @click="showLogout = false" class="btn-secondary flex-1">Cancel</button>
            <button @click="logout" class="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold active:scale-95 transition-all">Sign Out</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChecklistStore } from '@/stores/checklist'

const auth    = useAuthStore()
const store   = useChecklistStore()
const router  = useRouter()

const user    = computed(() => auth.user)
const stats   = computed(() => store.stats)

const joinedDate = computed(() => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))

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
