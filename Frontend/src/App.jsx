import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Tasks from './pages/Tasks'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const onLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Mini Task Manager</h1>
        <nav>
          {user ? (
            <>
              <span className="username">Hi, {user}</span>
              <button className="btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="link">Login</Link>
              <Link to="/signup" className="link">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  )
}
