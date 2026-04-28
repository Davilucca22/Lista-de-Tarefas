import { useEffect, useMemo, useState } from 'react'
import { loadTasks, saveTasks } from '../services/taskStorage.js'

function createId() {
  return crypto?.randomUUID?.() ?? `t_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 }

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1
      const pw = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      if (pw !== 0) return pw
      return b.updatedAt - a.updatedAt
    })
  }, [tasks])

  function addTask(input) {
    const title = (input.title ?? '').trim()
    if (!title) throw new Error('Título é obrigatório.')

    const now = Date.now()
    const task = {
      id: createId(),
      title,
      description: (input.description ?? '').trim(),
      priority: input.priority ?? 'medium',
      status: input.status ?? 'pending',
      createdAt: now,
      updatedAt: now,
    }

    setTasks((prev) => [task, ...prev])
    return task
  }

  function updateTask(id, patch) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const nextTitle = patch.title == null ? t.title : String(patch.title).trim()
        if (!nextTitle) throw new Error('Título é obrigatório.')
        return {
          ...t,
          ...patch,
          title: nextTitle,
          description: patch.description == null ? t.description : String(patch.description),
          updatedAt: Date.now(),
        }
      }),
    )
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function toggleDone(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'pending' : 'done', updatedAt: Date.now() }
          : t,
      ),
    )
  }

  function resetAll() {
    setTasks([])
  }

  return {
    tasks,
    sortedTasks,
    addTask,
    updateTask,
    removeTask,
    toggleDone,
    resetAll,
  }
}

