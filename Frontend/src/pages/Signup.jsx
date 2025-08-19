import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await signup(username, password)
      nav('/tasks')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <form className="grid" onSubmit={onSubmit}>
        <label>Username</label>
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        <div>Already have an account? <Link className="link" to="/login">Login</Link></div>
      </form>
    </div>
  )
}
