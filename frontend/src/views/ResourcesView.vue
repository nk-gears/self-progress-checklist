<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto">

    <div class="card text-center py-4">
      <div class="text-3xl mb-1">📚</div>
      <h1 class="text-xl font-extrabold text-primary-800">Resources</h1>
      <p class="text-sm text-gray-400 mt-0.5">Useful links for your spiritual journey</p>
    </div>

    <div v-for="section in sections" :key="section.title" class="card space-y-1">
      <h2 class="mb-3">{{ section.title }}</h2>
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
const sections = [
  {
    title: 'BK Websites',
    links: [
      { icon: '🌐', label: 'BK Official Website', url: 'https://www.brahmakumaris.com', description: 'Brahma Kumaris World Spiritual University' },
      { icon: '📺', label: 'BK YouTube Channel', url: 'https://www.youtube.com/@BrahmaKumaris', description: 'Spiritual knowledge and meditation videos' },
      { icon: '🎙️', label: 'Murali Online', url: 'https://www.bkwsu.org/murali', description: 'Daily Murali classes and recordings' },
    ],
  },
  {
    title: 'Meditation & Study',
    links: [
      { icon: '🧘', label: 'Online Meditation', url: 'https://www.brahmakumaris.com/meditation', description: 'Guided meditation resources' },
      { icon: '📖', label: 'Spiritual Study', url: 'https://www.bkwsu.org', description: 'BK World Spiritual University resources' },
      { icon: '💫', label: 'Daily Thoughts', url: 'https://www.brahmakumaris.com/thoughts', description: 'Daily inspirational thoughts from Baba' },
    ],
  },
  {
    title: 'Self-Transformation',
    links: [
      { icon: '⭐', label: 'Soul Sustenance', url: 'https://www.soulsustenance.com', description: 'Daily spiritual food for the soul' },
      { icon: '🎵', label: 'BK Music', url: 'https://www.youtube.com/@bkshivani', description: 'Spiritual music and bhajans' },
      { icon: '📱', label: 'Awakening with BK', url: 'https://www.awakeningwithbrahmakumaris.com', description: 'Online programs and workshops' },
    ],
  },
]
</script>
