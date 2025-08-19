export default function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <div className="task">
      <div style={{flex:1}}>
        <h4 className="row">
          <span>{task.title}</span>
          <span className={`badge ${task.completed ? 'done' : 'todo'}`}>
            {task.completed ? 'Done' : 'Pending'}
          </span>
        </h4>
        {task.description ? <p className="mono">{task.description}</p> : null}
      </div>

      <div className="row">
        <button className="btn secondary" onClick={() => onToggle(task)}>
          {task.completed ? 'Mark Pending' : 'Mark Done'}
        </button>
        <button className="btn" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  )
}
