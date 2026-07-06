import { Router, Request, Response } from 'express';
import { todoStore } from '../store';
import { ApiResponse, Todo } from '../types';

const router = Router();

// GET /todos — ดูทั้งหมด
router.get('/', (_req: Request, res: Response<ApiResponse<Todo[]>>) => {
  const todos = todoStore.findAll();
  res.json({ success: true, data: todos });
});

// ── TODO ฝึกทำ: เพิ่ม route GET /todos/status/:status ───
// ใช้ todoStore.findByStatus()
// ตัวอย่าง: GET /todos/status/pending
//
// router.get('/status/:status', (req, res) => {
//   // เขียนตรงนี้
// });

router.get('/status/:status', (req: Request, res: Response<ApiResponse<Todo[]>>) => {
  const status = String(req.params.status) as Todo['status'];
  if (status !== 'pending' && status !== 'done') {
    return res.status(400).json({ success: false, message: 'status ต้องเป็น pending หรือ done' });
  }
  const todos = todoStore.findByStatus(status);
  res.json({ success: true, data: todos });
});

// GET /todos/:id — ดูตาม id
router.get('/:id', (req: Request, res: Response<ApiResponse<Todo>>) => {
  const id = String(req.params.id);
  const todo = todoStore.findById(id);
  if (!todo) {
    return res.status(404).json({ success: false, message: 'ไม่พบ todo' });
  }
  res.json({ success: true, data: todo });
});

// POST /todos — สร้างใหม่
router.post('/', (req: Request, res: Response<ApiResponse<Todo>>) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ success: false, message: 'ต้องมี title' });
  }

  const todo = todoStore.create({ title });
  res.status(201).json({ success: true, data: todo });
});

// PATCH /todos/:id — แก้ไข
router.patch('/:id', (req: Request, res: Response<ApiResponse<Todo>>) => {
  const updated = todoStore.update(String(req.params.id), req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'ไม่พบ todo' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /todos/:id — ลบ
router.delete('/:id', (req: Request, res: Response<ApiResponse<null>>) => {
  const deleted = todoStore.delete(String(req.params.id));
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'ไม่พบ todo' });
  }
  res.json({ success: true, message: 'ลบสำเร็จ' });
});

export default router;
