/**
 * บทที่ 5: Destructuring & Spread
 * ใช้บ่อยตอนรับ request body, query params
 */

export function runLesson05(): void {
  console.log('\n📘 บทที่ 5: Destructuring & Spread');

  const user = { id: '1', name: 'Panapol', email: 'p@mail.com', role: 'admin' };

  // Object destructuring
  const { name, role } = user;
  console.log('  destructure:', name, role);

  // Rename ตอน destructure
  const { email: userEmail } = user;
  console.log('  rename:', userEmail);

  // Default value
  const { phone = 'ไม่ระบุ' } = user as typeof user & { phone?: string };
  console.log('  default:', phone);

  // Array destructuring
  const colors = ['red', 'green', 'blue'];
  const [first, second] = colors;
  console.log('  array:', first, second);

  // Rest in destructuring
  const { id, ...rest } = user; // rest = ทุก field ที่เหลือ
  console.log('  rest:', rest);

  // Spread — คัดลอก + merge object
  const updatedUser = { ...user, role: 'user', lastLogin: new Date() };
  console.log('  spread update role:', updatedUser.role);

  // Spread array
  const moreColors = [...colors, 'yellow', 'purple'];
  console.log('  spread array:', moreColors);

  // ใช้จริงใน backend — รับ body จาก request
  const requestBody = { productId: 'p1', quantity: 3, note: 'ด่วน' };
  const { productId, quantity } = requestBody;
  console.log('  request:', productId, 'x', quantity);
}
