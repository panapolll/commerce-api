/**
 * บทที่ 2: Functions
 */

// ── Function declaration ──────────────────────────────────
function greet(name: string): string {
  return `สวัสดี ${name}`;
}

// ── Arrow function (นิยมมากใน backend) ───────────────────
const double = (n: number): number => n * 2;

// ── Default parameter ─────────────────────────────────────
function createUser(name: string, role: string = 'user') {
  return { name, role, createdAt: new Date() };
}

// ── Rest parameter ────────────────────────────────────────
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

// ── Higher-order function (รับ function เป็น argument) ──
function applyDiscount(price: number, discountFn: (p: number) => number): number {
  return discountFn(price);
}

const tenPercentOff = (price: number) => price * 0.9;

// ── TODO ฝึกทำ: เขียน function calculateTotal ─────────────
// รับ items: { price: number; qty: number }[]
// คืนค่า ราคารวมทั้งหมด
//
// function calculateTotal(items: { price: number; qty: number }[]): number {
//   // เขียนตรงนี้
// }

function calculateTotal(items: { price: number; qty: number }[]): number {
  return items.reduce((total, item) => total + item.price * item.qty, 0);
}

export function runLesson02(): void {
  console.log('\n📘 บทที่ 2: Functions');
  console.log('  greet:', greet('น้องรัก'));
  console.log('  double(7):', double(7));
  console.log('  createUser:', createUser('Admin'));
  console.log('  sum:', sum(10, 20, 30));
  console.log('  discount:', applyDiscount(100, tenPercentOff));
  console.log(
    '  calculateTotal:',
    calculateTotal([
      { price: 50, qty: 2 },
      { price: 30, qty: 1 },
    ]),
  );
}
