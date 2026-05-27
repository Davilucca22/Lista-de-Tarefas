import { useState } from 'react'
import * as authService from '../services/authService.js'

const TOKEN_KEY = 'taskflow:token'

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  const payload = decodeToken(token)
  // descarta token expirado
  if (!payload || payload.exp * 1000 < Date.now()) {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
  return token
}

export function useAuth() {
  const [token, setToken] = useState(() => getStoredToken())

  const user = token ? decodeToken(token) : null

  async function register(name, email, password) {
    const data = await authService.register(name, email, password)
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
    }
    return data
  }

  async function login(email, password) {
    const data = await authService.login(email, password)
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
    }
    return data
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return { user, token, login, register, logout, isAuthenticated: !!token }
}
