<template>
  <button class="card flex items-center gap-4 w-full text-left" @click="showFeedback = true">
    <div class="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-xl flex-shrink-0">💬</div>
    <div class="flex-1">
      <div class="font-semibold text-gray-700">Feedback & Suggestions</div>
      <div class="text-xs text-gray-400">Share feedback or areas of improvement</div>
    </div>
    <span class="text-primary-400">→</span>
  </button>

  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="showFeedback" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="closeFeedback">
        <div class="bg-white w-full rounded-t-3xl p-6 safe-area-bottom max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <h3 class="font-bold text-gray-800 mb-4">Feedback & Suggestions</h3>

          <div v-if="feedbackSent" class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-2">🙏</div>
            <p class="font-semibold text-gray-700">Thank you for your feedback!</p>
            <div class="flex gap-2 mt-6">
              <button class="btn-primary flex-1" @click="resetFeedbackForm">Submit another</button>
              <button class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100" @click="closeFeedback">Close</button>
            </div>
          </div>

          <div v-else class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-gray-500">Rate the app</label>
              <div class="mt-1">
                <StarRating v-model="appRating" activeClass="text-amber-400" />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500">Feedback</label>
              <textarea v-model="feedbackText" rows="3" class="input-field mt-1"
                placeholder="What would you like to share with us?"></textarea>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500">Areas of improvement</label>
              <textarea v-model="improvementText" rows="3" class="input-field mt-1"
                placeholder="What can we do better?"></textarea>
            </div>
            <p v-if="feedbackError" class="text-xs text-red-500">{{ feedbackError }}</p>
            <button class="btn-primary w-full mt-2" :disabled="submittingFeedback || (!appRating && !feedbackText.trim() && !improvementText.trim())"
              @click="sendFeedback">
              {{ submittingFeedback ? 'Submitting…' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { submitFeedback } from '@/services/feedback'
import StarRating from '@/components/StarRating.vue'

const auth = useAuthStore()

const showFeedback       = ref(false)
const appRating          = ref(0)
const feedbackText       = ref('')
const improvementText    = ref('')
const feedbackError      = ref('')
const submittingFeedback = ref(false)
const feedbackSent       = ref(false)

function resetFeedbackForm() {
  appRating.value       = 0
  feedbackText.value    = ''
  improvementText.value = ''
  feedbackError.value   = ''
  feedbackSent.value    = false
}

function closeFeedback() {
  showFeedback.value = false
  resetFeedbackForm()
}

// Each submission is independent — a user can send feedback as many times as they like.
async function sendFeedback() {
  feedbackError.value      = ''
  submittingFeedback.value = true
  try {
    await submitFeedback({
      name:        auth.user?.displayName || '',
      email:       auth.user?.email || '',
      centreName:  auth.user?.centreName || '',
      rating:      appRating.value,
      feedback:    feedbackText.value.trim(),
      improvement: improvementText.value.trim(),
    })
    feedbackSent.value = true
  } catch (e) {
    feedbackError.value = e instanceof Error ? e.message : 'Could not submit feedback. Please try again.'
  } finally {
    submittingFeedback.value = false
  }
}
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.2s, transform 0.25s; }
.sheet-enter-from, .sheet-leave-to       { opacity: 0; transform: translateY(100%); }
</style>
