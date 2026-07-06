import { runLesson01 } from './lessons/01-variables';
import { runLesson02 } from './lessons/02-functions';
import { runLesson03 } from './lessons/03-async-await';
import { runLesson04 } from './lessons/04-array-methods';
import { runLesson05 } from './lessons/05-destructuring';

async function main() {
  console.log('🎓 Backend Practice — Syntax Lessons');
  console.log('=====================================');

  runLesson01();
  runLesson02();
  await runLesson03();
  runLesson04();
  runLesson05();

  console.log('\n✅ จบทุกบทแล้ว! ต่อไปลอง yarn dev เพื่อฝึก REST API');
}

main().catch(console.error);
