import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from?.pathname || '/tasks'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(username, password)
      nav(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form className="grid" onSubmit={onSubmit}>
        <label>Username</label>
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
        <div>New here? <Link className="link" to="/signup">Create an account</Link></div>
      </form>
    </div>
  )
}
