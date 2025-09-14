import type { TaskType } from '../taskType';

type Props = {
  taskType: TaskType
  onToggle(taskType: TaskType): void
  onEdit(taskType: TaskType): void
  onDelete(taskType: TaskType): void
}

const fmt = (n: number) => new Date(n).toLocaleString()

export default function TaskList({ taskType, onToggle, onEdit, onDelete }: Props) {
  return (
    <li className={"item " + (taskType.done ? 'done' : '')} role="listitem">
      <input
        aria-label={taskType.done ? 'Mark as not done' : 'Mark as done'}
        title={taskType.done ? 'Mark as not done' : 'Mark as done'}
        className="checkbox"
        type="checkbox"
        checked={taskType.done}
        onChange={() => onToggle(taskType)}
      />
      <div>
        <h3 className="title">{taskType.title}</h3>
        {taskType.description && <div className="meta" aria-label="description">{taskType.description}</div>}
      </div>
      <div className="row-actions" aria-label="actions">
        <button className="btn secondary" onClick={() => onEdit(taskType)} aria-label={`Edit ${taskType.title}`}>
          Edit
        </button>
        <button className="btn danger" onClick={() => onDelete(taskType)} aria-label={`Delete ${taskType.title}`}>
          Delete
        </button>
      </div>
    </li>
  )
}
