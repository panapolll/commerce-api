/**
 * บทที่ 1: Variables & Types
 * รัน: yarn lesson (หรือ ts-node src/lessons/01-variables.ts)
 */

// ── const vs let ──────────────────────────────────────────
// const = ค่าคงที่ (เปลี่ยน reference ไม่ได้)
// let   = เปลี่ยนค่าได้

const serverPort = 3000;
let requestCount = 0;
requestCount += 1;

// ── Primitive Types ───────────────────────────────────────
const username: string = 'panapol';
const age: number = 25;
const isAdmin: boolean = false;

// ── Array & Object ────────────────────────────────────────
const fruits: string[] = ['มังคุด', 'ทุเรียน', 'มะม่วง'];

const user: { id: number; name: string; role: string } = {
  id: 1,
  name: 'Panapol',
  role: 'user',
};

// ── Type alias (นิยมใช้ใน backend) ─────────────────────────
type Role = 'admin' | 'user' | 'guest'; // union type

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

const product: Product = {
  id: 'p1',
  name: 'มังคุด',
  price: 50,
  inStock: true,
};

// ── Optional & Nullable ───────────────────────────────────
interface Order {
  id: string;
  note?: string; // optional — อาจมีหรือไม่มี
}

const order: Order = { id: 'o1' };
// order.note = 'ส่งด่วน'; // uncomment ได้

export function runLesson01(): void {
  console.log('\n📘 บทที่ 1: Variables & Types');
  console.log('  port:', serverPort, '| requests:', requestCount);
  console.log('  user:', user);
  console.log('  fruits:', fruits.join(', '));
  console.log('  product:', product);
  console.log('  order:', order);
}
