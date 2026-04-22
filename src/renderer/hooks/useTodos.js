import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'wooper-todos'

function loadFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveToLocalStorage(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate) - new Date(b.dueDate)
  })
}

export function useTodos() {
  const [todos, setTodos] = useState([])
  const loadedRef = useRef(false)

  useEffect(() => {
    const load = async () => {
      if (window.electronAPI) {
        const saved = await window.electronAPI.getTodos()
        setTodos(saved || [])
      } else {
        setTodos(loadFromLocalStorage())
      }
      loadedRef.current = true
    }
    load()
  }, [])

  useEffect(() => {
    if (!loadedRef.current) return
    if (window.electronAPI) {
      window.electronAPI.saveTodos(todos)
    } else {
      saveToLocalStorage(todos)
    }
  }, [todos])

  const addTodo = ({ text, dueDate }) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      dueDate: dueDate || null,
      completed: false
    }
    setTodos(prev => [...prev, newTodo])
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return { todos: sortTodos(todos), addTodo, toggleTodo, deleteTodo }
}
