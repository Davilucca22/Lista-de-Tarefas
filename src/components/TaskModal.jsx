import { useEffect, useMemo, useState } from 'react'
import { Button } from './Button.jsx'

export function TaskModal({ open, initialTask, onClose, onSave }) {
  const isEdit = Boolean(initialTask?.id)

  const defaults = useMemo(
    () => ({
      title: initialTask?.title ?? '',
      description: initialTask?.description ?? '',
      priority: initialTask?.priority ?? 'medium',
      status: initialTask?.status ?? 'pending',
    }),
    [initialTask],
  )

  const [title, setTitle] = useState(defaults.title)
  const [description, setDescription] = useState(defaults.description)
  const [priority, setPriority] = useState(defaults.priority)
  const [status, setStatus] = useState(defaults.status)
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(defaults.title)
    setDescription(defaults.description)
    setPriority(defaults.priority)
    setStatus(defaults.status)
    setError('')
  }, [defaults])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      onSave({
        title,
        description,
        priority,
        status,
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
            <p className="mt-1 text-sm text-slate-300">Prioridade e status ajudam na organização.</p>
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Fechar modal">
            Fechar
          </Button>
        </div>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-300">Título *</label>
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
            <label className="mb-1 block text-xs text-slate-300">Descrição</label>
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
              <label className="mb-1 block text-xs text-slate-300">Prioridade</label>
              <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-300">Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pendente</option>
                <option value="done">Concluída</option>
              </select>
            </div>
          </div>

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

