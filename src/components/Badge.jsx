const PRIORITY_LABEL = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
}

const STATUS_LABEL = {
  pending: 'Pendente',
  done: 'Concluída',
}

export function Badge({ variant, value }) {
  const label =
    variant === 'priority' ? PRIORITY_LABEL[value] ?? value : STATUS_LABEL[value] ?? value

  const classes =
    variant === 'priority'
      ? value === 'high'
        ? 'border-rose-600/25 bg-rose-500/10 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200'
        : value === 'medium'
          ? 'border-amber-600/25 bg-amber-500/10 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200'
          : 'border-sky-600/25 bg-sky-500/10 text-sky-800 dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-sky-200'
      : value === 'done'
        ? 'border-emerald-600/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200'
        : 'border-violet-600/25 bg-violet-500/10 text-violet-800 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${classes}`}>
      {label}
    </span>
  )
}

