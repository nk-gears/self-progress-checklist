<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto">

    <!-- ── Hero header ────────────────────────────────────────────────────── -->
    <div class="card bg-gradient-to-br from-primary-700 to-indigo-600 border-0 text-white">
      <div class="text-center py-2">
        <div class="w-14 h-14 mx-auto mb-1.5 rounded-full bg-white shadow-md flex items-center justify-center">
          <img src="/supreme.png" class="w-11 h-11" alt="" />
        </div>
        <h1 class="text-xl font-extrabold tracking-tight">{{ t('resources.title') }}</h1>
        <p class="text-primary-200 text-sm mt-0.5">{{ t('resources.subtitle') }}</p>
      </div>
    </div>

    <div v-for="section in sections" :key="section.titleKey" class="card space-y-1">
      <h2 class="mb-3">{{ t(`resources.${section.titleKey}`) }}</h2>
      <a
        v-for="link in section.links"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 active:bg-primary-100 transition-colors"
      >
        <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-xl flex-shrink-0">
          {{ link.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-800 text-sm">{{ link.label }}</div>
          <div class="text-xs text-gray-400 mt-0.5 truncate">{{ link.description }}</div>
        </div>
        <svg class="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
      </a>
    </div>

    <div class="pb-4"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sections = [
  {
    titleKey: 'bkWebsites',
    links: [
      { icon: '🌐', label: 'BK Official Website', url: 'https://www.brahmakumaris.com', description: 'Brahma Kumaris World Spiritual University' },
      { icon: '📺', label: 'BK YouTube - HQ', url: 'https://www.youtube.com/@BrahmaKumaris', description: 'Spiritual knowledge and meditation videos' },
      { icon: '🎙️', label: 'BK Tamil YouTube', url: 'https://www.youtube.com/@brahmakumaristn', description: 'Daily Murali classes and recordings' },
      { icon: '🎙️', label: 'BK Tamil Live', url: 'https://www.youtube.com/@brahmakumaristn/live', description: 'Live Events' },
    ],
  },
  {
    titleKey: 'meditationStudy',
    links: [
      { icon: '🧘', label: 'Online Meditation', url: 'https://www.brahmakumaris.com/meditation', description: 'Guided meditation resources' },
      { icon: '📖', label: 'Spiritual Study', url: 'https://madhubanmurli.org/', description: 'Daily Murli - Official' },
      { icon: '💫', label: 'Daily Thoughts', url: 'https://www.brahmakumaris.com/thoughts', description: 'Daily inspirational thoughts from Baba' },
    ],
  }
]
</script>
