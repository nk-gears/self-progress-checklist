<template>
  <div class="flex gap-1">
    <button
      v-for="n in 5"
      :key="n"
      @click.stop="emit('update:modelValue', modelValue === n ? 0 : n)"
      :disabled="disabled"
      class="text-xl transition-all active:scale-90 disabled:cursor-default"
      :class="n <= modelValue ? 'text-amber-400' : 'text-gray-200'"
    >
      ★
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number   // 0–5
  disabled?: boolean
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
</script>
