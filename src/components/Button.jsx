export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition ' +
    'focus:outline-none focus:ring-2 focus:ring-violet-500/20 active:translate-y-[0.5px]'

  const sizes = {
    md: 'px-3 py-2',
    sm: 'px-2.5 py-1.5 text-xs',
  }

  const variants = {
    default:
      'border-black/10 bg-white text-slate-900 hover:bg-slate-50 ' +
      'dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10',
    primary:
      'border-violet-600/30 bg-violet-600 text-white hover:bg-violet-700 ' +
      'dark:border-violet-400/30 dark:bg-violet-600/70 dark:hover:bg-violet-600/85',
    danger:
      'border-rose-600/25 bg-rose-600 text-white hover:bg-rose-700 ' +
      'dark:border-rose-400/30 dark:bg-rose-600/35 dark:text-slate-100 dark:hover:bg-rose-600/45',
    ghost:
      'border-black/10 bg-transparent text-slate-900 hover:bg-black/[0.04] ' +
      'dark:border-white/10 dark:text-slate-100 dark:hover:bg-white/5',
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  )
}

