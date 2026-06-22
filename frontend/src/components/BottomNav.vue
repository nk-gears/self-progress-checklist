<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-100 z-50 shadow-lg safe-area-bottom">
    <div class="flex">

      <button
        v-for="tab in tabs"
        :key="tab.path"
        @click="router.push(tab.path)"
        class="flex-1 flex flex-col items-center justify-center py-3 gap-1 relative transition-colors duration-150"
        :class="isActive(tab.path) ? 'text-primary-600' : 'text-gray-400'"
      >
        <span
          v-if="isActive(tab.path)"
          class="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary-600 rounded-b-full"
        />
        <!-- Home -->
        <svg v-if="tab.icon === 'home'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <!-- Chart -->
        <svg v-else-if="tab.icon === 'chart'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="12" width="4" height="9" rx="1" stroke-linecap="round" stroke-linejoin="round" />
          <rect x="10" y="7" width="4" height="14" rx="1" stroke-linecap="round" stroke-linejoin="round" />
          <rect x="17" y="3" width="4" height="18" rx="1" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <!-- Resources -->
        <svg v-else-if="tab.icon === 'resources'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <!-- Profile -->
        <svg v-else-if="tab.icon === 'profile'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="text-xs font-bold tracking-wide">{{ tab.label }}</span>
      </button>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router   = useRouter()
const route    = useRoute()
const { t }    = useI18n()
const isActive = (path: string) => route.path === path

const tabs = computed(() => [
  { path: '/home',      label: t('nav.home'),      icon: 'home'      },
  { path: '/chart',     label: t('nav.chart'),     icon: 'chart'     },
  { path: '/resources', label: t('nav.resources'), icon: 'resources' },
  { path: '/profile',   label: t('nav.profile'),   icon: 'profile'   },
])
</script>
