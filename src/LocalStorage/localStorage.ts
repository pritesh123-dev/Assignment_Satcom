import type { TaskType } from "../taskType";

const KEY = 'todo.items.v1'

export function getTask(): TaskType[] {

    try{
        const val = localStorage.getItem(KEY);

        if(!val) {
            return []
        } else {
            const data = JSON.parse(val) as TaskType[];
            return data.sort((a, b) => b.createdAt - a.createdAt)
        }
    } catch {
        return []
    }
}


export function setTask(tasks : TaskType[]) {
    localStorage.setItem(KEY, JSON.stringify(tasks))
}

export { KEY as STORAGE_KEY }