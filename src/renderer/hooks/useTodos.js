/**
 * CLAUDE CODE INSTRUCTIONS — useTodos.js
 *
 * Custom React hook for managing the to-do list with Electron persistence.
 *
 * RETURNS: { todos, addTodo, toggleTodo, deleteTodo }
 *
 * IMPLEMENTATION:
 * 1. On mount, call window.electronAPI.getTodos() to load saved todos.
 *    Set state with the result.
 * 2. Whenever todos change, call window.electronAPI.saveTodos(todos).
 *    Use a useEffect with todos as dependency (skip the initial load trigger).
 * 3. addTodo({ text, dueDate }) — creates { id: crypto.randomUUID(), text, dueDate, completed: false }
 * 4. toggleTodo(id) — flips the completed boolean.
 * 5. deleteTodo(id) — removes from array.
 * 6. Return todos ALREADY SORTED: ascending by dueDate, nulls last.
 *
 * If window.electronAPI is undefined (e.g. running in browser dev),
 * fall back to localStorage under key 'wooper-todos'.
 */