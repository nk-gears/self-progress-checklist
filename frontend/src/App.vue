<template>
  <div class="flex flex-col min-h-screen" :class="isLoggedIn ? 'bg-primary-50' : ''">

    <main class="flex-1" :class="isLoggedIn && route.path !== '/login' ? 'pb-20' : ''">
      <RouterView :key="route.path" />
    </main>

    <BottomNav v-if="isLoggedIn && route.path !== '/login'" />

    <DevSwitcher />

    <PwaPrompt v-if="isLoggedIn" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import DevSwitcher from '@/components/DevSwitcher.vue'
import PwaPrompt from '@/components/PwaPrompt.vue'
import { useAuthStore } from '@/stores/auth'

const authStore  = useAuthStore()
const router     = useRouter()
const route      = useRoute()

const isLoggedIn = computed(() => authStore.isLoggedIn)

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn && route.path === '/login') router.push('/home')
})
</script>
