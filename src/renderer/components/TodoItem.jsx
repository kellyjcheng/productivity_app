/**
 * CLAUDE CODE INSTRUCTIONS — TodoItem.jsx
 *
 * A single row in the to-do list.
 *
 * PROPS:
 *  - todo: { id: string, text: string, dueDate: string|null, completed: bool }
 *  - onToggle(id)   → mark complete/incomplete
 *  - onDelete(id)   → remove from list
 *
 * DISPLAY:
 * - Checkbox on the left. When checked, text gets strikethrough + opacity 0.5.
 * - Task text in the middle.
 * - Due date shown below task text in small muted text.
 *   Format as "Due: Mon, Apr 28" using toLocaleDateString.
 *   If overdue and not completed, show due date in red (#ef5350).
 * - Delete button (×) on the right, visible on hover.
 *
 * Keep styling lean and import from TodoList.css.
 */