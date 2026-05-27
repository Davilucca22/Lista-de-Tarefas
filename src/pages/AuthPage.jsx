import { useState } from 'react'
import { ThemeToggle } from '../components/ThemeToggle.jsx'
import { useTheme } from '../hooks/useTheme.js'

export function AuthPage({ onLogin, onRegister }) {
  const { isDark, toggleTheme } = useTheme()
  const [tab, setTab] = useState('login') // 'login' | 'register'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const data =
        tab === 'login'
          ? await onLogin(email, password)
          : await onRegister(name, email, password)
      if (data.msg) setMsg(data.msg)
    } catch {
      setMsg('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  function switchTab(t) {
    setTab(t)
    setMsg('')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex justify-end border-b border-black/10 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-black/20">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="card w-full max-w-sm p-8">
          <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight">
            TaskFlow
          </h1>

          <div className="mb-6 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                tab === 'login'
                  ? 'bg-white shadow dark:bg-slate-700'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                tab === 'register'
                  ? 'bg-white shadow dark:bg-slate-700'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'register' && (
              <div>
                <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                  Nome
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                E-mail
              </label>
              <input
                className="input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                Senha
              </label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {msg && (
              <p className="rounded-md bg-slate-100 px-3 py-2 text-center text-sm dark:bg-slate-800">
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? 'Aguarde...'
                : tab === 'login'
                  ? 'Entrar'
                  : 'Criar conta'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
