import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { TaskType } from './taskType';
import { setTask, getTask } from './LocalStorage/localStorage';
import TaskList from './Components/taskList';
import './App.css'


type Task = {
   title: string; 
   description: string;
}

const MAX_TITLE = 120
const MAX_DESC  = 1000

export default function App() {
  const [tasks, setTasks] = useState<TaskType[]>(() => getTask())
  const [draft, setDraft] = useState<Task>({ title: '', description: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string>('')

  // Persist to localStorage on change
  useEffect(() => { setTask(tasks) }, [tasks])

  // Ensure reverse-chronological order (newest first)
  const ordered = useMemo(() => {
    return [...tasks].sort((a, b) => b.createdAt - a.createdAt)
  }, [tasks])

  // Accessibility: focus title field when starting edit
  const titleRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (editingId && titleRef.current) titleRef.current.focus()
  }, [editingId])

  function validate(d: Task): string | null {
    if (!d.title.trim()) return 'Title is required.'
    if (d.title.length > MAX_TITLE) return `Title must be <= ${MAX_TITLE} characters.`
    if (d.description.length > MAX_DESC) return `Description must be <= ${MAX_DESC} characters.`
    return null
  }

  function resetDraft() { 
    setDraft({ title: '', description: '' })
    setEditingId(null)
    setError('')
  }

  function upsertTask(e: React.FormEvent) {
    e.preventDefault()
    const msg = validate(draft)
    if (msg) { setError(msg); return }
    const now = Date.now()
    if (editingId) {
      setTasks(prev => prev.map(t => t.id === editingId ? { ...t, title: draft.title.trim(), description: draft.description.trim(), updatedAt: now } : t))
    } else {
      const t: TaskType = {
        id: Date.now(),
        title: draft.title.trim(),
        description: draft.description.trim(),
        done: false,
        createdAt: now,
        updatedAt: now,
      }
      setTasks(prev => [t, ...prev])
    }
    resetDraft()
  }

  function onToggle(task: TaskType) {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done, updatedAt: Date.now() } : t))
  }
  function onEdit(task: TaskType) {
    setEditingId(task.id)
    setDraft({ title: task.title, description: task.description ?? '' })
  }
  function onDelete(task: TaskType) {
    setTasks(prev => prev.filter(t => t.id !== task.id))
    if (editingId === task.id) resetDraft()
  }

  return (
    <>
    <div className="container">
      <div className="card" role="region" aria-label="To-do app">
        <header className="header">
          <h1>Today</h1>
        </header>

        <form className="form" onSubmit={upsertTask} noValidate aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">{editingId ? 'Edit task' : 'Add task'}</h2>

          <div>
            <label htmlFor="title">Title <span aria-hidden="true">*</span></label>
            <input
              ref={titleRef}
              id="title"
              className="input"
              value={draft.title}
              onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
              maxLength={MAX_TITLE}
              required
              placeholder="Please enter the title"
              aria-invalid={!!error}
              aria-describedby={error ? 'err' : undefined}
            />
          </div>

          <div>
            <label htmlFor="desc">Description (optional)</label>
            <textarea
              id="desc"
              className="textarea"
              value={draft.description}
              onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))}
              maxLength={MAX_DESC}
              rows={3}
              placeholder="Add details…"
            />
          </div>

          {error && <div id="err" className="error" role="alert" aria-live="assertive">{error}</div>}

          <div className="actions">
            {editingId && (
              <button type="button" className="btn secondary" onClick={resetDraft} aria-label="Cancel edit">
                Cancel
              </button>
            )}
            <button type="submit" className="btn ok" aria-label={editingId ? 'Save changes' : 'Add task'}>
              {editingId ? 'Save' : 'Add'}
            </button>
          </div>
        </form>

        <ul className="list" role="list" aria-label="Task list">
          {ordered.length === 0 ? (
            <div className="empty" aria-live="polite">Nothing here yet. Add your first task!</div>
          ) : (
            ordered.map(task => (
              <TaskList
                key={task.id}
                taskType={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </ul>
      </div>
    </div>
    </>
  )
}
