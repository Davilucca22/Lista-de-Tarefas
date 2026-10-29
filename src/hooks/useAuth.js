import { useState } from 'react'
import * as authService from '../services/authService.js'

const TOKEN_KEY = 'taskflow:token'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  const payload = decodeToken(token)
  // descarta token expirado
  if (!payload || payload.exp * 1000 < Date.now() || !['manager', 'member'].includes(payload.ROLE)) {
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

  function replaceToken(nextToken) {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
  }

  return { user, token, login, register, logout, replaceToken, isAuthenticated: !!token }
}
