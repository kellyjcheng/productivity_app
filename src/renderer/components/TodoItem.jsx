import '../styles/TodoList.css'

function formatDueDate(dateStr) {
  if (!dateStr) return null
  // Append T00:00:00 to avoid UTC offset shifting the displayed date
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  return due < today
}

export default function TodoItem({ todo, onToggle, onDelete }) {
  const overdue = isOverdue(todo.dueDate) && !todo.completed
  const dueDateFormatted = formatDueDate(todo.dueDate)

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        {dueDateFormatted && (
          <span className={`todo-due${overdue ? ' overdue' : ''}`}>
            Due: {dueDateFormatted}
          </span>
        )}
      </div>
      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
        title="Delete"
      >
        ×
      </button>
    </li>
  )
}
