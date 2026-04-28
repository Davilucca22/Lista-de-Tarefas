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
    default: 'border-white/10 bg-white/5 hover:bg-white/10',
    primary: 'border-violet-400/30 bg-violet-600/60 hover:bg-violet-600/75',
    danger: 'border-rose-400/30 bg-rose-600/30 hover:bg-rose-600/40',
    ghost: 'border-white/10 bg-transparent hover:bg-white/5',
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  )
}

