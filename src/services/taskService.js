// Mapeamento entre os valores do front e os do banco
export const PRIORITY_TO_BACK = { high: 'Alta', medium: 'Média', low: 'Baixa' }
export const PRIORITY_FROM_BACK = { Alta: 'high', Média: 'medium', Baixa: 'low' }
export const STATUS_TO_BACK = { pending: 'Pendente', done: 'Concluida' }
export const STATUS_FROM_BACK = { Pendente: 'pending', Concluida: 'done' }

function dateOnly(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

export function fromBackend(item) {
  const assignee = item.ASSIGNED_TO && typeof item.ASSIGNED_TO === 'object'
    ? item.ASSIGNED_TO
    : null
  return {
    id: item._id,
    title: item.TITULO,
    description: item.DESCRICAO || '',
    priority: PRIORITY_FROM_BACK[item.PRIORIDADE] ?? 'medium',
    status: STATUS_FROM_BACK[item.STATUS] ?? 'pending',
    category: item.CATEGORIA || item.CATEGORY || 'Geral',
    dueDate: dateOnly(item.DATA_VENCIMENTO || item.DUE_DATE),
    assigneeId: assignee?._id ?? item.ASSIGNED_TO ?? '',
    assigneeName: assignee?.NAME ?? '',
    updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : Date.now(),
  }
}

async function readResponse(response) {
  const data = await response.json()
  if (!response.ok) throw new Error(data.msg || 'Não foi possível concluir a operação.')
  return data
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function fetchTasks(token) {
  const res = await fetch('/api/list', { headers: authHeaders(token) })
  return readResponse(res)
}

export async function createTask(token, { titulo, descricao, prioridade, status, category, dueDate, responsavel }) {
  const res = await fetch('/api/add', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      form: {
        titulo,
        descricao,
        prioridade,
        status,
        CATEGORIA: category,
        DATA_VENCIMENTO: dueDate,
        responsavel,
      },
    }),
  })
  return readResponse(res)
}

export async function updateTask(token, { _id, TITULO, DESCRICAO, PRIORIDADE, STATUS, CATEGORIA, DATA_VENCIMENTO, ASSIGNED_TO }) {
  const res = await fetch('/api/edit', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ form: { _id, TITULO, DESCRICAO, PRIORIDADE, STATUS, CATEGORIA, DATA_VENCIMENTO, ASSIGNED_TO } }),
  })
  return readResponse(res)
}

export async function deleteTask(token, taskId) {
  const res = await fetch(`/api/delete?IdItem=${taskId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return readResponse(res)
}
