import { useMemo, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { TaskList } from '../components/TaskList.jsx'
import { TaskModal } from '../components/TaskModal.jsx'
import { ThemeToggle } from '../components/ThemeToggle.jsx'
import { useTasks } from '../hooks/useTasks.js'
import { useTheme } from '../hooks/useTheme.js'

function formatCount(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`
}

export function HomePage({ user, onLogout }) {
  const { sortedTasks, addTask, updateTask, removeTask, toggleDone, resetAll } = useTasks()
  const { isDark, toggleTheme } = useTheme()

  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sortedTasks.filter((t) => {
      if (filterStatus !== 'all' && t.status !== filterStatus) return false
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description ? t.description.toLowerCase().includes(q) : false)
      )
    })
  }, [sortedTasks, query, filterStatus, filterPriority])

  const stats = useMemo(() => {
    const total = sortedTasks.length
    const pending = sortedTasks.filter((t) => t.status === 'pending').length
    const done = sortedTasks.filter((t) => t.status === 'done').length
    return { total, pending, done }
  }, [sortedTasks])

  function openNew() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditing(task)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  function handleSave(values) {
    if (editing?.id) {
      updateTask(editing.id, values)
    } else {
      addTask(values)
    }
    closeModal()
  }

  function handleDelete(task) {
    const ok = window.confirm(`Excluir a tarefa "${task.title}"?`)
    if (!ok) return
    removeTask(task.id)
  }

  function handleReset() {
    const ok = window.confirm('Isso vai apagar TODAS as tarefas. Continuar?')
    if (!ok) return
    resetAll()
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">TaskFlow</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {user?.NAME && <span className="mr-2">Olá, {user.NAME} •</span>}
              {formatCount(stats.total, 'tarefa', 'tarefas')} •{' '}
              {formatCount(stats.pending, 'pendente', 'pendentes')} •{' '}
              {formatCount(stats.done, 'concluída', 'concluídas')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <Button variant="primary" onClick={openNew}>
              + Nova tarefa
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Resetar
            </Button>
            {onLogout && (
              <Button variant="ghost" onClick={onLogout}>
                Sair
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <section className="card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Buscar</label>
              <input
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Título ou descrição..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Status</label>
              <select
                className="select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="done">Concluída</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                Prioridade
              </label>
              <select
                className="select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-4">
          <TaskList
            tasks={filtered}
            onToggleDone={toggleDone}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <TaskModal
        open={modalOpen}
        initialTask={editing}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  )
}

