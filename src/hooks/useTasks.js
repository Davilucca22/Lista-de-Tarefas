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
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetchTasks(token)
      .then((data) => {
        if (data.list) setTasks(data.list.map(fromBackend))
        setError('')
      })
      .catch((loadError) => setError(loadError.message || 'Não foi possível carregar as tarefas.'))
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
      category: (input.category ?? 'Geral').trim() || 'Geral',
      dueDate: input.dueDate ?? '',
      responsavel: input.assigneeId || '',
    })

    if (data.addToList) {
      setTasks((prev) => [fromBackend(data.addToList), ...prev])
    }
    setError('')
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
      CATEGORIA: updated.category,
      DATA_VENCIMENTO: updated.dueDate,
      ASSIGNED_TO: updated.assigneeId,
    })

    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    setError('')
  }

  async function removeTask(id) {
    await deleteTask(token, id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setError('')
  }

  async function toggleDone(id) {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    await updateTask(id, { status: task.status === 'done' ? 'pending' : 'done' })
  }

  async function resetAll(canDeleteAssigned = false) {
    const removable = canDeleteAssigned ? tasks : tasks.filter((task) => !task.assigneeId)
    await Promise.all(removable.map((task) => deleteTask(token, task.id)))
    const removedIds = new Set(removable.map((task) => task.id))
    setTasks((prev) => prev.filter((task) => !removedIds.has(task.id)))
    setError('')
  }

  return { tasks, sortedTasks, addTask, updateTask, removeTask, toggleDone, resetAll, error }
}
