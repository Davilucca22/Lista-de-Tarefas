// Mapeamento entre os valores do front e os do banco
export const PRIORITY_TO_BACK = { high: 'Alta', medium: 'Média', low: 'Baixa' }
export const PRIORITY_FROM_BACK = { Alta: 'high', Média: 'medium', Baixa: 'low' }
export const STATUS_TO_BACK = { pending: 'Pendente', done: 'Concluida' }
export const STATUS_FROM_BACK = { Pendente: 'pending', Concluida: 'done' }

export function fromBackend(item) {
  return {
    id: item._id,
    title: item.TITULO,
    description: item.DESCRICAO || '',
    priority: PRIORITY_FROM_BACK[item.PRIORIDADE] ?? 'medium',
    status: STATUS_FROM_BACK[item.STATUS] ?? 'pending',
    updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : Date.now(),
  }
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function fetchTasks(token) {
  const res = await fetch('/api/list', { headers: authHeaders(token) })
  return res.json()
}

export async function createTask(token, { titulo, descricao, prioridade, status }) {
  const res = await fetch('/api/add', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ form: { titulo, descricao, prioridade, status } }),
  })
  return res.json()
}

export async function updateTask(token, { _id, TITULO, DESCRICAO, PRIORIDADE, STATUS }) {
  const res = await fetch('/api/edit', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ form: { _id, TITULO, DESCRICAO, PRIORIDADE, STATUS } }),
  })
  return res.json()
}

export async function deleteTask(token, taskId) {
  const res = await fetch(`/api/delete?IdItem=${taskId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return res.json()
}
