import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [saving, setSaving] = useState(false)

  const pending = useMemo(() => tasks.filter(t => !t.completed), [tasks])
  const done = useMemo(() => tasks.filter(t => t.completed), [tasks])

  const load = async () => {
    setError(''); setLoading(true)
    try {
      const { data } = await api.get('/tasks/')
      setTasks(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onCreate = () => { setEditTask(null); setShowForm(true) }
  const onEdit = (task) => { setEditTask(task); setShowForm(true) }
  const onCancel = () => { setShowForm(false); setEditTask(null) }

  const onDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return
    try {
      await api.delete(`/tasks/${task.id}`)
      setTasks(prev => prev.filter(t => t.id !== task.id))
    } catch (err) {
      alert(err?.response?.data?.detail || 'Delete failed')
    }
  }

  const onToggle = async (task) => {
    try {
      const { data } = await api.put(`/tasks/${task.id}`, { completed: !task.completed })
      setTasks(prev => prev.map(t => t.id === task.id ? data : t))
    } catch (err) {
      alert(err?.response?.data?.detail || 'Update failed')
    }
  }

  const onSave = async (payload) => {
    setSaving(true)
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask.id}`, payload)
        setTasks(prev => prev.map(t => t.id === editTask.id ? data : t))
      } else {
        const { data } = await api.post('/tasks/', payload)
        setTasks(prev => [data, ...prev])
      }
      setShowForm(false); setEditTask(null)
    } catch (err) {
      alert(err?.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <h2>Your Tasks</h2>
        <button className="btn" onClick={onCreate}>+ New Task</button>
      </div>

      {loading ? <div className="card">Loading…</div> : null}
      {error ? <div className="card error">{error}</div> : null}

      {showForm && (
        <TaskForm initial={editTask} onCancel={onCancel} onSave={onSave} loading={saving} />
      )}

      <div className="grid grid-2">
        <section className="card">
          <h3>Pending ({pending.length})</h3>
          {pending.length === 0 ? <div className="mono">No pending tasks.</div> : pending.map(t =>
            <TaskItem key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
          )}
        </section>
        <section className="card">
          <h3>Completed ({done.length})</h3>
          {done.length === 0 ? <div className="mono">Nothing completed yet.</div> : done.map(t =>
            <TaskItem key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
          )}
        </section>
      </div>
    </div>
  )
}
