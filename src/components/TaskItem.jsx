import { Badge } from './Badge.jsx'
import { Button } from './Button.jsx'

export function TaskItem({ task, onToggleDone, onEdit, onDelete }) {
  return (
    <li className="card p-4 transition hover:bg-black/[0.03] dark:hover:bg-white/[0.07]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-base font-semibold tracking-tight ${
                task.status === 'done'
                  ? 'text-slate-500 line-through dark:text-slate-300'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {task.description ? (
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
              {task.description}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="priority" value={task.priority} />
            <Badge variant="status" value={task.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleDone(task.id)}
            title={task.status === 'done' ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {task.status === 'done' ? 'Reabrir' : 'Concluir'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(task)} title="Editar tarefa">
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(task)} title="Excluir tarefa">
            Excluir
          </Button>
        </div>
      </div>
    </li>
  )
}

