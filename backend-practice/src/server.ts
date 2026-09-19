import express from 'express';
import todoRoutes from './api/routes/todos';

const app = express();
const PORT = process.env.PORT ?? 4000;

// Middleware — parse JSON body
app.use(express.json());

// Logger middleware — ฝึกเข้าใจ middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/todos', todoRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend practice server running!' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Practice server: http://localhost:${PORT}`);
  console.log('   GET    /health');
  console.log('   GET    /todos');
  console.log('   POST   /todos          { "title": "..." }');
  console.log('   PATCH  /todos/:id      { "status": "done" }');
  console.log('   DELETE /todos/:id');
  console.log('   GET    /todos/status/pending\n');
});
