import { supabase } from './supabase'

export const SCRAPER_API = 'https://gp2ea5vro1.execute-api.ap-south-1.amazonaws.com'

/**
 * Send an authorised POST request to the Scraper Service.
 * Automatically attaches the user's Supabase JWT.
 */
export async function postWithJWT<T = unknown>(path: string, body?: unknown): Promise<T> {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session?.access_token) {
    throw new Error('Unable to obtain authentication token')
  }

  const res = await fetch(`${SCRAPER_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Scraper request failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<T>
}

// Convenience wrappers ------------------------------------------------------

export function startProfileScrape() {
  return postWithJWT('/scraper/profile')
}

export async function startTopicScrape(topic: string) {
  const body = { topic, max_pages: 5 }
  console.log('Invoking /scraper/topic', body)

  // Try to obtain a Supabase session for an auth token (optional)
  const { data: { session } } = await supabase.auth.getSession()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  // Fire the POST request
  const res = await fetch(`${SCRAPER_API}/scraper/topic`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  console.log('Scraper response status', res.status)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Scraper request failed: ${res.status} ${text}`)
  }
  return res.json()
}
