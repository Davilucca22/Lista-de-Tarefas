import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import { isInitialManagerEmail } from './auth.js'
import { List } from '../model/models.js'
import {
  canDeleteTask,
  canUpdateTask,
  isValidDueDate,
  isValidPriorityAndStatus,
  isValidTaskId,
  taskVisibilityFilter,
} from './taskPermissions.js'

test('validates date-only deadlines and rejects impossible dates', () => {
  assert.equal(isValidDueDate('2028-02-29'), true)
  assert.equal(isValidDueDate('2027-02-29'), false)
  assert.equal(isValidDueDate('29-02-2028'), false)
  assert.equal(isValidDueDate(''), true)
})

test('accepts only supported task priorities and statuses', () => {
  assert.equal(isValidPriorityAndStatus('Alta', 'Pendente'), true)
  assert.equal(isValidPriorityAndStatus('Urgente', 'Pendente'), false)
  assert.equal(isValidPriorityAndStatus('Baixa', 'Em andamento'), false)
})

test('scopes task lists to the account or assigned team member', () => {
  const memberId = new mongoose.Types.ObjectId().toString()
  const teamId = new mongoose.Types.ObjectId().toString()
  const memberFilter = taskVisibilityFilter({ id: memberId, TEAM: teamId, ROLE: 'member' })
  const managerFilter = taskVisibilityFilter({ id: memberId, TEAM: teamId, ROLE: 'manager' })

  assert.deepEqual(memberFilter, {
    $or: [
      { ID_USER: memberId, TEAM: null },
      { TEAM: teamId, ASSIGNED_TO: memberId },
    ],
  })
  assert.deepEqual(managerFilter, {
    $or: [
      { ID_USER: memberId, TEAM: null },
      { TEAM: teamId },
    ],
  })
})

test('allows members to update assigned tasks but only managers to delete team tasks', () => {
  const managerId = new mongoose.Types.ObjectId()
  const memberId = new mongoose.Types.ObjectId()
  const teamId = new mongoose.Types.ObjectId()
  const task = {
    ID_USER: managerId,
    TEAM: teamId,
    ASSIGNED_TO: memberId,
  }

  assert.equal(canUpdateTask(task, { id: memberId.toString(), TEAM: teamId.toString(), ROLE: 'member' }), true)
  assert.equal(canDeleteTask(task, { id: memberId.toString(), TEAM: teamId.toString(), ROLE: 'member' }), false)
  assert.equal(canDeleteTask(task, { id: managerId.toString(), TEAM: teamId.toString(), ROLE: 'manager' }), true)
  assert.equal(canUpdateTask(task, { id: memberId.toString(), TEAM: '', ROLE: 'member' }), false)
})

test('validates task identifiers', () => {
  assert.equal(isValidTaskId(new mongoose.Types.ObjectId().toString()), true)
  assert.equal(isValidTaskId('not-an-object-id'), false)
})

test('reserves the configured initial manager email', () => {
  assert.equal(isInitialManagerEmail(' Davi@Gmail.com '), true)
  assert.equal(isInitialManagerEmail('someone@example.com'), false)
})

test('persists category and due date as recognized task schema fields', () => {
  const task = new List({
    ID_USER: new mongoose.Types.ObjectId(),
    TITULO: 'Entregar relatório',
    PRIORIDADE: 'Alta',
    STATUS: 'Pendente',
    CATEGORIA: 'Trabalho',
    DATA_VENCIMENTO: new Date('2026-11-15T00:00:00.000Z'),
  })

  assert.equal(task.get('CATEGORIA'), 'Trabalho')
  assert.equal(task.get('DATA_VENCIMENTO').toISOString(), '2026-11-15T00:00:00.000Z')
  assert.equal(List.schema.path('DATA_VENCIMENTO').instance, 'Date')
  assert.equal(task.validateSync(), undefined)
})
