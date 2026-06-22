const FEEDBACK_API_URL = import.meta.env.VITE_FEEDBACK_API_URL as string | undefined

export type FeedbackPayload = {
  name: string
  email: string
  centreName: string
  rating: number // 0-5
  feedback: string
  improvement: string
}

// Google Apps Script web apps don't return CORS headers by default, so the
// request is sent with mode: 'no-cors' — the browser won't let us read the
// response, but the script still receives and processes the POST body.
export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  if (!FEEDBACK_API_URL) throw new Error('Feedback endpoint is not configured')
  await fetch(FEEDBACK_API_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
  })
}
