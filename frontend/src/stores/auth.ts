import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, TOKEN_KEY, type ApiUser } from '@/services/api'
import { useDevModeStore } from './devMode'
import { MOCK_USER } from '@/services/mockData'
import type { User } from '@/types'

const MOCK_LS_KEY = 'spc_mock_logged_in'

function mapUser(u: ApiUser): User {
  return {
    uid:         String(u.id),
    email:       u.email,
    displayName: u.display_name ?? u.email.split('@')[0],
    photoURL:    null,
    centreName:  u.centre_name ?? null,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user    = ref<User | null>(null)
  const loading = ref(true)
  const error   = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value)

  let initialized = false

  const initAuth = async () => {
    if (initialized) return
    initialized = true

    const dev = useDevModeStore()
    if (dev.isMock) {
      user.value    = localStorage.getItem(MOCK_LS_KEY) ? MOCK_USER : null
      loading.value = false
      return
    }

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { loading.value = false; return }

    try {
      const { user: u } = await api.getProfile()
      user.value = mapUser(u)
    } catch {
      localStorage.removeItem(TOKEN_KEY)
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async (idToken: string) => {
    const dev = useDevModeStore()
    if (dev.isMock) {
      user.value = MOCK_USER
      localStorage.setItem(MOCK_LS_KEY, '1')
      return
    }
    const { token, user: u } = await api.loginWithGoogle(idToken)
    localStorage.setItem(TOKEN_KEY, token)
    user.value = mapUser(u)
  }

  const logout = () => {
    const dev = useDevModeStore()
    if (dev.isMock) localStorage.removeItem(MOCK_LS_KEY)
    else            localStorage.removeItem(TOKEN_KEY)
    user.value = null
  }

  const updateProfile = async (displayName: string, centreName: string) => {
    if (!user.value) return
    const dev = useDevModeStore()
    if (dev.isMock) {
      user.value = { ...user.value, displayName, centreName }
      return
    }
    await api.updateProfile(displayName, centreName)
    user.value = { ...user.value, displayName, centreName }
  }

  return { user, loading, error, isLoggedIn, initAuth, loginWithGoogle, logout, updateProfile }
})
