import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => localStorage.getItem('user') || '')

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', user)
    else localStorage.removeItem('user')
  }, [user])

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    // backend returns { access_token, token_type }
    setToken(data.access_token)
    setUser(username)
  }

  const signup = async (username, password) => {
    await api.post('/auth/signup', { username, password })
    // optional auto-login after signup:
    return login(username, password)
  }

  const logout = () => {
    setToken('')
    setUser('')
  }

  const value = { token, user, login, signup, logout }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
