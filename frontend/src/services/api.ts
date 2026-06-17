const BASE = (import.meta.env.VITE_API_URL as string).replace(/\/$/, '')

const TOKEN_KEY = 'spc_token'

function token(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const t = token()
  if (t) headers['Authorization'] = `Bearer ${t}`

  const res  = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!data.success) throw new ApiError(data.message || `Request failed (${res.status})`, res.status)
  return data as T
}

export type ApiUser = {
  id: number
  email: string
  display_name: string | null
  centre_name: string | null
}

export type ApiEntry = {
  date: string
  gyanMurali: boolean
  gyanMuraliStars: number
  gyanRevision: boolean
  yogAmritvela: boolean
  yogAmritvelaStars: number
  yogExtraHours: number
  yogTrafficControl: boolean
  yogTrafficStars: number
  dharanaAim: string
  dharanaMorningPledge: boolean
  dharanaNightCheck: boolean
  dharanaNightStars: number
  sevaDone: boolean
  sevaStars: number
  totalPoints: number
  remarks: string
  updatedAt: string
}

export const api = {
  loginWithGoogle: (id_token: string) =>
    request<{ token: string; user: ApiUser }>('POST', '/google', { id_token }),

  getEntries: () =>
    request<{ entries: ApiEntry[] }>('GET', '/entries'),

  saveEntry: (entry: Omit<ApiEntry, 'updatedAt'>) =>
    request<{ success: boolean; totalPoints: number }>('POST', '/entries', entry),

  getProfile: () =>
    request<{ user: ApiUser & { created_at: string } }>('GET', '/profile'),

  updateProfile: (display_name: string, centre_name: string) =>
    request<{ success: boolean }>('PUT', '/profile', { display_name, centre_name }),
}

export { TOKEN_KEY }
