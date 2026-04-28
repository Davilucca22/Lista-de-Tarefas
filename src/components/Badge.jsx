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
        ? 'border-rose-400/30 bg-rose-500/15 text-rose-200'
        : value === 'medium'
          ? 'border-amber-400/30 bg-amber-500/15 text-amber-200'
          : 'border-sky-400/30 bg-sky-500/15 text-sky-200'
      : value === 'done'
        ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
        : 'border-violet-400/30 bg-violet-500/15 text-violet-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${classes}`}>
      {label}
    </span>
  )
}

