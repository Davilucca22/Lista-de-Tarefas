import mongoose from 'mongoose'

export function taskVisibilityFilter(user) {
  const personalTasks = { ID_USER: user.id, TEAM: null }
  if (user.ROLE === 'manager' && user.TEAM) {
    return { $or: [personalTasks, { TEAM: user.TEAM }] }
  }
  if (user.ROLE === 'member' && user.TEAM) {
    return {
      $or: [
        personalTasks,
        { TEAM: user.TEAM, ASSIGNED_TO: user.id },
      ],
    }
  }
  return personalTasks
}

export function canUpdateTask(task, user) {
  if (!task.TEAM) return task.ID_USER.toString() === user.id
  if (task.TEAM.toString() !== user.TEAM) return false
  return user.ROLE === 'manager' || task.ASSIGNED_TO?.toString() === user.id
}

export function canDeleteTask(task, user) {
  if (!task.TEAM) return task.ID_USER.toString() === user.id
  return task.TEAM.toString() === user.TEAM && user.ROLE === 'manager'
}

export function isValidDueDate(value) {
  if (value == null || value === '') return true
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function isValidPriorityAndStatus(priority, status) {
  return ['Alta', 'Média', 'Baixa'].includes(priority)
    && ['Pendente', 'Concluida', 'Concluída'].includes(status)
}

export function isValidTaskId(id) {
  return mongoose.isValidObjectId(id)
}
