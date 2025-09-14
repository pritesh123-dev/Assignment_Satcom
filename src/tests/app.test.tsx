
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import {STORAGE_KEY} from '../LocalStorage/localStorage'

describe('To‑Do App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty state', () => {
    render(<App />)
    expect(screen.getByText(/Nothing here yet/i)).toBeInTheDocument()
  })

  it('validates title required', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/Title is required/i)
  })

  it('adds a task and persists to localStorage', () => {
    render(<App />)
    const title = screen.getByLabelText(/Title/i)
    fireEvent.change(title, { target: { value: 'Task1' } })
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Task1')).toBeInTheDocument()

    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).toBeTruthy()
    const tasks = JSON.parse(raw!)
    expect(tasks.length).toBe(1)
    expect(tasks[0].title).toBe('Task1')
  })
})
