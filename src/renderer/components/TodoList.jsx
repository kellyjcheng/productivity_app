import { useState } from 'react'
import { useTodos } from '../hooks/useTodos.js'
import TodoItem from './TodoItem.jsx'
import '../styles/TodoList.css'

export default function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos()
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    addTodo({ text: trimmed, dueDate: dueDate || null })
    setText('')
    setDueDate('')
  }

  return (
    <section className="todo-section">
      <h2 className="section-header">Tasks</h2>
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="todo-form-row">
          <input
            className="todo-input"
            type="text"
            placeholder="Add a task..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="todo-add-btn" type="submit">+</button>
        </div>
        <input
          className="todo-date-input"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </form>
      <ul className="todo-list">
        {todos.length === 0 && (
          <li className="todo-empty">No tasks yet — add one above!</li>
        )}
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </section>
  )
}
