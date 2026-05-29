import { useAuth } from './hooks/useAuth.js'
import { AuthPage } from './pages/AuthPage.jsx'
import { HomePage } from './pages/HomePage.jsx'

export default function App() {
  const { isAuthenticated, user, login, register, logout } = useAuth()

  if (!isAuthenticated) {
    return <AuthPage onLogin={login} onRegister={register} />
  }

  return <HomePage user={user} token={token} onLogout={logout} />
}
