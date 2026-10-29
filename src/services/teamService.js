function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function request(path, token, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: authHeaders(token),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.msg || 'Não foi possível concluir a operação.')
  return data
}

export function fetchTeam(token) {
  return request('/api/team', token)
}

export function createTeam(token, name) {
  return request('/api/team', token, {
    method: 'POST',
    body: JSON.stringify({ form: { name } }),
  })
}

export function fetchInvites(token) {
  return request('/api/team/invites', token)
}

export function inviteMember(token, email) {
  return request('/api/team/invites', token, {
    method: 'POST',
    body: JSON.stringify({ form: { email } }),
  })
}

export function respondToInvite(token, inviteId, accept) {
  return request('/api/team/invites/respond', token, {
    method: 'POST',
    body: JSON.stringify({ form: { inviteId, accept } }),
  })
}

export function fetchTeamDashboard(token) {
  return request('/api/team/dashboard', token)
}
