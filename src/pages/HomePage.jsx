import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { TaskList } from '../components/TaskList.jsx'
import { TaskModal } from '../components/TaskModal.jsx'
import { ThemeToggle } from '../components/ThemeToggle.jsx'
import { useTasks } from '../hooks/useTasks.js'
import { useTeam } from '../hooks/useTeam.js'
import { useTheme } from '../hooks/useTheme.js'

function formatCount(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`
}

function localDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isOverdue(task, today) {
  return task.status === 'pending' && task.dueDate && task.dueDate < today
}

function isDueSoon(task, now) {
  if (task.status !== 'pending' || !task.dueDate) return false
  const [year, month, day] = task.dueDate.split('-').map(Number)
  const deadline = new Date(year, month - 1, day, 23, 59, 59, 999)
  const remaining = deadline.getTime() - now.getTime()
  return remaining >= 0 && remaining <= 24 * 60 * 60 * 1000
}

export function HomePage({ user, token, onLogout, onTokenChange }) {
  const {
    sortedTasks,
    addTask,
    updateTask,
    removeTask,
    toggleDone,
    resetAll,
    error: taskError,
  } = useTasks(token)
  const isManager = user?.ROLE === 'manager'
  const {
    team,
    members,
    invites,
    dashboard,
    error: teamError,
    createTeam,
    inviteMember,
    respondToInvite,
  } = useTeam(token, isManager, onTokenChange)
  const { isDark, toggleTheme } = useTheme()

  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterDeadline, setFilterDeadline] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [now, setNow] = useState(() => new Date())
  const [operationError, setOperationError] = useState('')
  const [teamName, setTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [message, setMessage] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const today = localDateKey(now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const categories = useMemo(
    () => [...new Set(sortedTasks.map((task) => task.category || 'Geral'))].sort((a, b) => a.localeCompare(b)),
    [sortedTasks],
  )

  const notifications = useMemo(
    () => sortedTasks.filter((task) => isOverdue(task, today) || isDueSoon(task, now)),
    [sortedTasks, today, now],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sortedTasks.filter((task) => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false
      if (filterCategory !== 'all' && (task.category || 'Geral') !== filterCategory) return false
      if (filterAssignee !== 'all' && task.assigneeId !== filterAssignee) return false
      if (filterDeadline === 'overdue' && !isOverdue(task, today)) return false
      if (filterDeadline === 'soon' && !isDueSoon(task, now)) return false
      if (filterDeadline === 'no-date' && task.dueDate) return false
      if (!q) return true
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        (task.category || '').toLowerCase().includes(q) ||
        (task.assigneeName || '').toLowerCase().includes(q)
      )
    })
  }, [sortedTasks, query, filterStatus, filterPriority, filterDeadline, filterAssignee, filterCategory, today, now])

  const stats = useMemo(() => {
    const total = sortedTasks.length
    const pending = sortedTasks.filter((task) => task.status === 'pending').length
    const done = sortedTasks.filter((task) => task.status === 'done').length
    const overdue = sortedTasks.filter((task) => isOverdue(task, today)).length
    return { total, pending, done, overdue }
  }, [sortedTasks, today])

  function openNew() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditing(task)
    setModalOpen(true)
  }

  async function handleSave(values) {
    if (editing?.id) {
      await updateTask(editing.id, values)
    } else {
      await addTask(values)
    }
    setOperationError('')
    setModalOpen(false)
  }

  async function handleDelete(task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return
    try {
      await removeTask(task.id)
      setOperationError('')
    } catch (error) {
      setOperationError(error.message)
    }
  }

  async function handleToggleDone(id) {
    try {
      await toggleDone(id)
      setOperationError('')
    } catch (error) {
      setOperationError(error.message)
    }
  }

  async function handleReset() {
    if (!window.confirm('Isso vai apagar as tarefas que você pode excluir. Continuar?')) return
    try {
      await resetAll(isManager)
      setOperationError('')
    } catch (error) {
      setOperationError(error.message)
    }
  }

  async function handleCreateTeam(event) {
    event.preventDefault()
    try {
      const data = await createTeam(teamName)
      setTeamName('')
      setMessage(data.msg)
      setOperationError('')
    } catch (error) {
      setOperationError(error.message)
    }
  }

  async function handleInvite(event) {
    event.preventDefault()
    try {
      const data = await inviteMember(inviteEmail)
      setInviteEmail('')
      setMessage(data.msg)
      setOperationError('')
    } catch (error) {
      setOperationError(error.message)
    }
  }

  async function handleInviteResponse(inviteId, accept) {
    try {
      const data = await respondToInvite(inviteId, accept)
      setMessage(data.msg)
      setOperationError('')
    } catch (error) {
      setOperationError(error.message)
    }
  }

  const visibleError = operationError || taskError || teamError

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
              {formatCount(stats.done, 'concluída', 'concluídas')} •{' '}
              {formatCount(stats.overdue, 'atrasada', 'atrasadas')}
            </p>
            {team && <p className="mt-1 text-xs text-slate-500">Equipe: {team.NAME}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <Button variant="primary" onClick={openNew}>+ Nova tarefa</Button>
            <Button variant="danger" onClick={handleReset}>Resetar</Button>
            {onLogout && <Button variant="ghost" onClick={onLogout}>Sair</Button>}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        {(visibleError || message) && (
          <div className={`mb-4 rounded-xl border p-3 text-sm ${visibleError ? 'border-rose-400/40 bg-rose-500/10 text-rose-700 dark:text-rose-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'}`}>
            {visibleError || message}
          </div>
        )}

        {notifications.length > 0 && (
          <section className="mb-4 rounded-2xl border border-amber-400/50 bg-amber-50 p-4 dark:bg-amber-500/10" aria-live="polite">
            <h2 className="font-semibold">Avisos de prazo ({notifications.length})</h2>
            <ul className="mt-2 grid gap-1 text-sm">
              {notifications.slice(0, 5).map((task) => (
                <li key={task.id}>
                  {isOverdue(task, today) ? 'Atrasada' : 'Vence nas próximas 24h'}: {task.title}
                  {task.dueDate ? ` — ${task.dueDate}` : ''}
                </li>
              ))}
            </ul>
            {notifications.length > 5 && <p className="mt-1 text-xs">E mais {notifications.length - 5} tarefa(s).</p>}
          </section>
        )}

        {invites.length > 0 && (
          <section className="card mb-4 p-4">
            <h2 className="font-semibold">Convites para equipe</h2>
            <ul className="mt-3 grid gap-3">
              {invites.map((invite) => (
                <li key={invite._id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span>{invite.INVITED_BY?.NAME || 'Um gestor'} convidou você para {invite.TEAM?.NAME || 'uma equipe'}.</span>
                  <span className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => handleInviteResponse(invite._id, true)}>Aceitar</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleInviteResponse(invite._id, false)}>Recusar</Button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {isManager && !team && (
          <section className="card mb-4 p-4">
            <h2 className="font-semibold">Criar sua equipe</h2>
            <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleCreateTeam}>
              <input className="input" value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Nome da equipe" maxLength={60} required />
              <Button variant="primary" type="submit">Criar equipe</Button>
            </form>
          </section>
        )}

        {isManager && team && (
          <section className="card mb-4 p-4">
            <h2 className="font-semibold">Equipe e indicadores</h2>
            <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleInvite}>
              <input className="input" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="E-mail de uma conta já cadastrada" required />
              <Button variant="primary" type="submit">Convidar membro</Button>
            </form>
            <p className="mt-2 text-xs text-slate-500">O convite aparecerá na caixa de entrada do TaskFlow do usuário.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="py-2 pr-3">Membro</th>
                    <th className="py-2 pr-3">Concluídas</th>
                    <th className="py-2 pr-3">Pendentes</th>
                    <th className="py-2">Atrasadas</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.map((member) => (
                    <tr key={member.id} className="border-b border-black/5 dark:border-white/5">
                      <td className="py-2 pr-3">{member.name}</td>
                      <td className="py-2 pr-3">{member.completed}</td>
                      <td className="py-2 pr-3">{member.pending}</td>
                      <td className="py-2">{member.overdue}</td>
                    </tr>
                  ))}
                  {dashboard.length === 0 && (
                    <tr><td className="py-3 text-slate-500" colSpan="4">Ainda não há membros na equipe.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Buscar</label>
              <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, descrição, categoria ou responsável..." />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Status</label>
              <select className="select" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="done">Concluída</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Prioridade</label>
              <select className="select" value={filterPriority} onChange={(event) => setFilterPriority(event.target.value)}>
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Prazo</label>
              <select className="select" value={filterDeadline} onChange={(event) => setFilterDeadline(event.target.value)}>
                <option value="all">Todos</option>
                <option value="overdue">Atrasadas</option>
                <option value="soon">Próximas de 24h</option>
                <option value="no-date">Sem prazo</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Categoria</label>
              <select className="select" value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
                <option value="all">Todas</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            {isManager && (
              <div>
                <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Responsável</label>
                <select className="select" value={filterAssignee} onChange={(event) => setFilterAssignee(event.target.value)}>
                  <option value="all">Todos</option>
                  <option value="">Não atribuídas</option>
                  {members.filter((member) => member.ROLE === 'member').map((member) => (
                    <option key={member._id} value={member._id}>{member.NAME}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </section>

        <section className="mt-4">
          <TaskList tasks={filtered} onToggleDone={handleToggleDone} onEdit={openEdit} onDelete={handleDelete} />
        </section>
      </main>

      <TaskModal
        key={editing?.id ?? 'new'}
        open={modalOpen}
        initialTask={editing}
        members={members}
        isManager={isManager && Boolean(team)}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
