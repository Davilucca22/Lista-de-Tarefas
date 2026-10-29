import test from 'node:test'
import assert from 'node:assert/strict'
import { createTask } from './taskService.js'

test('sends category and due date using the task schema field names', async () => {
  const originalFetch = globalThis.fetch
  let request
  globalThis.fetch = async (url, options) => {
    request = { url, options }
    return {
      ok: true,
      json: async () => ({ msg: 'Tarefa Adicionada!' }),
    }
  }

  try {
    await createTask('token', {
      titulo: 'Entregar relatório',
      descricao: '',
      prioridade: 'Alta',
      status: 'Pendente',
      category: 'Trabalho',
      dueDate: '2026-11-15',
    })

    assert.equal(request.url, '/api/add')
    assert.deepEqual(JSON.parse(request.options.body), {
      form: {
        titulo: 'Entregar relatório',
        descricao: '',
        prioridade: 'Alta',
        status: 'Pendente',
        CATEGORIA: 'Trabalho',
        DATA_VENCIMENTO: '2026-11-15',
      },
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})
