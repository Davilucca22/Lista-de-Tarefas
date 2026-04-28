const STORAGE_KEY = 'taskflow:tasks:v1'

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((t) => t && typeof t === 'object')
      .map(normalizeTask)
      .filter(Boolean)
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function normalizeTask(t) {
  const id = typeof t.id === 'string' ? t.id : null
  const title = typeof t.title === 'string' ? t.title.trim() : ''
  if (!id || !title) return null

  const priority = ['high', 'medium', 'low'].includes(t.priority) ? t.priority : 'medium'
  const status = ['pending', 'done'].includes(t.status) ? t.status : 'pending'

  const createdAt = typeof t.createdAt === 'number' ? t.createdAt : Date.now()
  const updatedAt = typeof t.updatedAt === 'number' ? t.updatedAt : createdAt

  return {
    id,
    title,
    description: typeof t.description === 'string' ? t.description : '',
    priority,
    status,
    createdAt,
    updatedAt,
  }
}
