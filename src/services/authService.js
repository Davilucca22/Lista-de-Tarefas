async function request(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form: body }),
  })
  return res.json()
}

export function register(name, email, password) {
  return request('/api/register', { name, email, password })
}

export function login(email, password) {
  return request('/api/login', { email, password })
}
