import { useEffect, useMemo, useState } from 'react'
import {
  fetchTasks,
  createTask,
  updateTask as apiUpdateTask,
  deleteTask,
  fromBackend,
  PRIORITY_TO_BACK,
  STATUS_TO_BACK,
} from '../services/taskService.js'

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 }

export function useTasks(token) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetchTasks(token)
      .then((data) => {
        if (data.list) setTasks(data.list.map(fromBackend))
      })
      .finally(() => setLoading(false))
  }, [token])

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1
      const pw = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      if (pw !== 0) return pw
      return b.updatedAt - a.updatedAt
    })
  }, [tasks])

  async function addTask(input) {
    const title = (input.title ?? '').trim()
    if (!title) throw new Error('Título é obrigatório.')

    const data = await createTask(token, {
      titulo: title,
      descricao: (input.description ?? '').trim(),
      prioridade: PRIORITY_TO_BACK[input.priority ?? 'medium'],
      status: STATUS_TO_BACK[input.status ?? 'pending'],
    })

    if (data.addToList) {
      setTasks((prev) => [fromBackend(data.addToList), ...prev])
    }
  }

  async function updateTask(id, patch) {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const nextTitle = patch.title == null ? task.title : String(patch.title).trim()
    if (!nextTitle) throw new Error('Título é obrigatório.')

    const updated = {
      ...task,
      ...patch,
      title: nextTitle,
      description: patch.description == null ? task.description : String(patch.description),
      updatedAt: Date.now(),
    }

    await apiUpdateTask(token, {
      _id: id,
      TITULO: updated.title,
      DESCRICAO: updated.description,
      PRIORIDADE: PRIORITY_TO_BACK[updated.priority],
      STATUS: STATUS_TO_BACK[updated.status],
    })

    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  async function removeTask(id) {
    await deleteTask(token, id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  async function toggleDone(id) {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    await updateTask(id, { status: task.status === 'done' ? 'pending' : 'done' })
  }

  async function resetAll() {
    await Promise.all(tasks.map((t) => deleteTask(token, t.id)))
    setTasks([])
  }

  return { tasks, sortedTasks, addTask, updateTask, removeTask, toggleDone, resetAll, loading }
}
