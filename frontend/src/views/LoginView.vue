<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-700 via-purple-600 to-indigo-600 p-6">

    <!-- Branding -->
    <div class="text-center mb-10 animate-fade-in">
      <div class="text-7xl mb-4 drop-shadow-lg">🌟</div>
      <h1 class="text-3xl font-bold text-white mb-1 tracking-tight">Move towards</h1>
      <h1 class="text-4xl font-extrabold text-amber-300 mb-2 tracking-tight">Sampoornatha</h1>
      <p class="text-primary-200 text-base">Self Transformation for Baba's Pratyakshatha</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl animate-slide-up">

      <!-- Mock shortcut -->
      <div v-if="isMock" class="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
        <p class="text-amber-700 font-semibold text-base mb-3">🎭 Mock mode</p>
        <button @click="mockLogin"
          class="w-full bg-amber-500 text-white rounded-xl py-3 font-bold text-base active:scale-95 transition-all">
          Enter as BK Vivek (Dev Preview)
        </button>
      </div>

      <p class="text-center text-gray-500 text-sm mb-6 font-medium">
        Sign in with your Google account to track your daily practice
      </p>

      <!-- Google Sign-In button -->
      <div class="flex justify-center min-h-[44px]">
        <div v-if="!googleReady" class="w-full h-11 bg-gray-100 rounded-xl animate-pulse"></div>
        <div ref="googleBtnRef"></div>
      </div>

      <p v-if="errorMsg" class="mt-4 text-red-500 text-sm text-center font-medium">{{ errorMsg }}</p>
      <p v-if="loading" class="mt-4 text-center text-sm text-primary-500 font-medium animate-pulse">Signing in…</p>

      <p class="mt-8 text-center text-xs text-gray-300">
        Your progress data is private and stored securely 🔒
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDevModeStore, devToolsEnabled } from '@/stores/devMode'

const authStore = useAuthStore()
const devStore  = useDevModeStore()
const router    = useRouter()

const googleBtnRef = ref<HTMLElement | null>(null)
const googleReady  = ref(false)
const loading      = ref(false)
const errorMsg     = ref('')

const isMock = computed(() => devStore.isMock && devToolsEnabled)

const mockLogin = async () => {
  await authStore.loginWithGoogle('')
  router.push('/home')
}

const handleCredential = async (response: { credential: string }) => {
  loading.value  = true
  errorMsg.value = ''
  try {
    await authStore.loginWithGoogle(response.credential)
    router.push('/home')
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Sign-in failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const script  = document.createElement('script')
  script.src    = 'https://accounts.google.com/gsi/client'
  script.async  = true
  script.onload = () => {
    const g = (window as any).google
    g.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
      callback:  handleCredential,
    })
    g.accounts.id.renderButton(googleBtnRef.value, {
      theme:          'outline',
      size:           'large',
      width:          300,
      text:           'signin_with',
      shape:          'pill',
      logo_alignment: 'left',
    })
    g.accounts.id.prompt()
    googleReady.value = true
  }
  script.onerror = () => { errorMsg.value = 'Failed to load Google Sign-In.' }
  document.head.appendChild(script)
})
</script>
