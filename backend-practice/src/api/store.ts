import { Todo, CreateTodoDto, UpdateTodoDto } from './types';

/**
 * In-memory store — ไม่ต้องใช้ database
 * ฝึก logic ก่อน ค่อยต่อ MongoDB ทีหลัง
 */
class TodoStore {
  private todos: Todo[] = [];
  private nextId = 1;

  findAll(): Todo[] {
    return [...this.todos];
  }

  findById(id: string): Todo | undefined {
    return this.todos.find((t) => t.id === id);
  }

  create(dto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: String(this.nextId++),
      title: dto.title,
      status: 'pending',
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  update(id: string, dto: UpdateTodoDto): Todo | null {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.todos[index] = { ...this.todos[index], ...dto };
    return this.todos[index];
  }

  delete(id: string): boolean {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;
  }

  // ── TODO ฝึกทำ: เขียน findByStatus ─────────────────────
  // รับ status: 'pending' | 'done'
  // คืน Todo[] ที่ตรง status
  //
  // findByStatus(status: TodoStatus): Todo[] {
  //   // เขียนตรงนี้
  // }

  findByStatus(status: Todo['status']): Todo[] {
    return this.todos.filter((t) => t.status === status);
  }
}

export const todoStore = new TodoStore();
