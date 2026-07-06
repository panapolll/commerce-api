/**
 * บทที่ 3: Async / Await / Promise
 * พื้นฐานสำคัญที่สุดของ backend — ทุกอย่างเกือบเป็น async
 */

// จำลองการเรียก database (ใช้เวลา 100ms)
function fakeDbQuery<T>(data: T, delayMs = 100): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

// ── async function คืนค่า Promise เสมอ ───────────────────
async function findUserById(id: string) {
  const user = await fakeDbQuery({ id, name: 'Panapol', role: 'admin' });
  return user;
}

// ── try / catch สำหรับจัดการ error ───────────────────────
async function safeFindUser(id: string) {
  try {
    const user = await findUserById(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ── Promise.all — รันหลาย async พร้อมกัน ─────────────────
async function loadDashboard(userId: string) {
  const [user, orders, products] = await Promise.all([
    fakeDbQuery({ id: userId, name: 'User' }),
    fakeDbQuery([{ id: 'o1' }, { id: 'o2' }]),
    fakeDbQuery([{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }]),
  ]);
  return { user, orderCount: orders.length, productCount: products.length };
}

// ── TODO ฝึกทำ: เขียน fetchWithRetry ─────────────────────
// ถ้า fn() throw error ให้ลองใหม่ maxRetries ครั้ง
// ถ้าครบแล้วยัง fail ให้ throw error ออกมา
//
// async function fetchWithRetry<T>(
//   fn: () => Promise<T>,
//   maxRetries: number,
// ): Promise<T> {
//   // เขียนตรงนี้
// }

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`  ⚠️  retry ${attempt}/${maxRetries}`);
    }
  }
  throw lastError;
}

export async function runLesson03(): Promise<void> {
  console.log('\n📘 บทที่ 3: Async / Await');

  const user = await findUserById('u1');
  console.log('  findUserById:', user);

  const result = await safeFindUser('u1');
  console.log('  safeFindUser:', result);

  const dashboard = await loadDashboard('u1');
  console.log('  dashboard:', dashboard);

  const data = await fetchWithRetry(() => fakeDbQuery('OK!'), 3);
  console.log('  fetchWithRetry:', data);
}
