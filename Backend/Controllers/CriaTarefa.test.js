import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import { CriaTarefa } from './CriaTarefa.js'
import { List } from '../model/models.js'

test('stores category and due date received from the create-task form', async () => {
  const originalCreate = List.create
  let savedTask
  let responseBody
  let responseStatus = 200

  List.create = async (fields) => {
    savedTask = fields
    return {
      populate: async () => {},
    }
  }

  const response = {
    status(status) {
      responseStatus = status
      return this
    },
    json(body) {
      responseBody = body
      return this
    },
  }

  try {
    await CriaTarefa({
      user: {
        id: new mongoose.Types.ObjectId().toString(),
        ROLE: 'member',
        TEAM: null,
      },
      body: {
        form: {
          titulo: 'Entregar relatório',
          descricao: 'Fechar o documento',
          prioridade: 'Alta',
          status: 'Pendente',
          CATEGORIA: 'Trabalho',
          DATA_VENCIMENTO: '2026-11-15',
        },
      },
    }, response)
  } finally {
    List.create = originalCreate
  }

  assert.equal(responseStatus, 200)
  assert.equal(savedTask.CATEGORIA, 'Trabalho')
  assert.equal(savedTask.DATA_VENCIMENTO.toISOString(), '2026-11-15T00:00:00.000Z')
  assert.ok(responseBody.addToList)
})
