import { TaskItem } from './TaskItem.jsx'

export function TaskList({ tasks, onToggleDone, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="card p-8 text-center">
        <h3 className="text-base font-semibold">Nenhuma tarefa ainda</h3>
        <p className="mt-1 text-sm text-slate-300">
          Crie sua primeira tarefa para começar a organizar seu fluxo.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

