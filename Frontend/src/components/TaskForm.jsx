import { useEffect, useState } from 'react'

export default function TaskForm({ initial, onCancel, onSave, loading }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [completed, setCompleted] = useState(Boolean(initial?.completed))

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '')
      setDescription(initial.description || '')
      setCompleted(Boolean(initial.completed))
    }
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    onSave({ title, description, completed })
  }

  return (
    <form onSubmit={submit} className="grid card">
      <label>Title</label>
      <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required />

      <label>Description</label>
      <textarea className="textarea" value={description} onChange={e=>setDescription(e.target.value)} />

      <div className="row">
        <input id="completed" type="checkbox" checked={completed} onChange={e=>setCompleted(e.target.checked)} />
        <label htmlFor="completed">Completed</label>
      </div>

      <div className="row" style={{justifyContent:'flex-end'}}>
        <button type="button" className="btn secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}
