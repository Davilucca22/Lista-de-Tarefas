// Em dev: VITE_API_URL não existe → usa proxy do Vite (/api → localhost:3000)
// Em produção: VITE_API_URL = URL do backend deployado (ex: https://taskflow-api.onrender.com)
const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form: body }),
  })
  return res.json()
}

export function register(name, email, password) {
  return request('/register', { name, email, password })
}

export function login(email, password) {
  return request('/login', { email, password })
}
