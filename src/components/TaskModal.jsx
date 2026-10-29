import { useEffect, useState } from 'react'
import { Button } from './Button.jsx'

export function TaskModal({ open, initialTask, onClose, onSave, members = [], isManager = false }) {
  const isEdit = Boolean(initialTask?.id)

  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [priority, setPriority] = useState(initialTask?.priority ?? 'medium')
  const [status, setStatus] = useState(initialTask?.status ?? 'pending')
  const [category, setCategory] = useState(initialTask?.category ?? 'Geral')
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? '')
  const [assigneeId, setAssigneeId] = useState(initialTask?.assigneeId ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      await onSave({
        title,
        description,
        priority,
        status,
        category,
        dueDate,
        assigneeId,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Editar tarefa' : 'Nova tarefa'}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form onSubmit={handleSubmit} className="card w-full max-w-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {isEdit ? 'Editar tarefa' : 'Nova tarefa'}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Prioridade e status ajudam na organização.
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Fechar modal">
            Fechar
          </Button>
        </div>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Título *</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Atualizar backlog"
              maxLength={80}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Descrição</label>
            <textarea
              className="input min-h-[96px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes, links, observações..."
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                Prioridade
              </label>
              <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pendente</option>
                <option value="done">Concluída</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Categoria</label>
              <input
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Trabalho, Casa..."
                maxLength={40}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Data de vencimento</label>
              <input
                className="input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {isManager && members.length > 0 && (
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Responsável</label>
              <select className="select" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                <option value="">Não atribuída</option>
                {members.filter((member) => member.ROLE === 'member').map((member) => (
                  <option key={member._id} value={member._id}>{member.NAME} ({member.EMAIL})</option>
                ))}
              </select>
            </div>
          )}

          {error ? (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  )
}
