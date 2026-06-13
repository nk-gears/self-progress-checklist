import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const KEY = 'spc_dev_mode'

export const devToolsEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true'

const getInitial = (): 'mock' | 'real' => {
  const param = new URLSearchParams(window.location.search).get('mode')
  if (param === 'mock' || param === 'real') return param
  return (localStorage.getItem(KEY) as 'mock' | 'real') ??
    (devToolsEnabled ? 'mock' : 'real')
}

export const useDevModeStore = defineStore('devMode', () => {
  const mode   = ref<'mock' | 'real'>(getInitial())
  const isMock = computed(() => mode.value === 'mock')

  const setMode = (m: 'mock' | 'real') => {
    localStorage.setItem(KEY, m)
    window.location.reload()
  }

  return { mode, isMock, setMode }
})
