export interface Task {
  createdAt: string
  description: string
  id: number
  status: TaskStatus
  title: string
}

export enum TaskStatus {
  All = 'all',
  Completed = 'completed',
  Incomplete = 'incomplete',
}

export interface TaskResponse {
  data: Task[]
  limit: number
  page: number
  total: number
}

export interface TaskFilter {
  limit: number
  page: number
  status: TaskStatus
}
