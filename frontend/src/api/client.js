const BASE = '/api/v1'

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const serversApi = {
  list: (params) => {
    const qs = new URLSearchParams(params).toString()
    return api(`/servers/?${qs}`)
  },
  get: (slug) => api(`/servers/${slug}`),
  create: (data) => api('/servers/', { method: 'POST', body: JSON.stringify(data) }),
}

export const reviewsApi = {
  list: (serverId) => api(`/reviews/?server_id=${serverId}`),
  create: (data) => api('/reviews/', { method: 'POST', body: JSON.stringify(data) }),
}
