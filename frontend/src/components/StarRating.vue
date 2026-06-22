<template>
  <div class="flex gap-1">
    <button
      v-for="n in 5"
      :key="n"
      @click.stop="emit('update:modelValue', modelValue === n ? 0 : n)"
      :disabled="disabled"
      class="text-xl transition-all active:scale-90 disabled:cursor-default"
      :class="n <= modelValue ? activeClass : 'text-gray-400'"
    >
      ★
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: number   // 0–5
  disabled?: boolean
  activeClass?: string
}>(), {
  activeClass: 'text-amber-400',
})
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
</script>
