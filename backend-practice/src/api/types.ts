export type TodoStatus = 'pending' | 'done';

export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: Date;
}

export interface CreateTodoDto {
  title: string;
}

export interface UpdateTodoDto {
  title?: string;
  status?: TodoStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
