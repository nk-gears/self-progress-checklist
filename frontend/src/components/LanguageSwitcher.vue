<template>
  <select
    :value="locale"
    @change="onChange"
    class="text-sm font-semibold rounded-xl px-3 py-2 border focus:outline-none focus:ring-2"
    :class="variant === 'light'
      ? 'bg-white/10 text-white border-white/30 focus:ring-white/40'
      : 'bg-primary-50 text-primary-700 border-primary-100 focus:ring-primary-300'"
  >
    <option v-for="l in SUPPORTED_LOCALES" :key="l.code" :value="l.code" class="text-gray-800">
      {{ l.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, setLocale, type LocaleCode } from '@/i18n'

withDefaults(defineProps<{ variant?: 'light' | 'default' }>(), { variant: 'default' })

const { locale } = useI18n()

function onChange(e: Event) {
  setLocale((e.target as HTMLSelectElement).value as LocaleCode)
}
</script>
