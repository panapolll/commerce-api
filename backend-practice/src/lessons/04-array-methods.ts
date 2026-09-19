/**
 * บทที่ 4: Array Methods
 * ใช้บ่อยมากตอนจัดการข้อมูลจาก database
 */

const products = [
  { id: '1', name: 'มังคุด', price: 50, stock: 100, category: 'fruit' },
  { id: '2', name: 'ทุเรียน', price: 500, stock: 0, category: 'fruit' },
  { id: '3', name: 'น้ำส้ม', price: 35, stock: 50, category: 'drink' },
  { id: '4', name: 'มะม่วง', price: 80, stock: 200, category: 'fruit' },
];

export function runLesson04(): void {
  console.log('\n📘 บทที่ 4: Array Methods');

  // map — แปลงทุก element
  const names = products.map((p) => p.name);
  console.log('  map names:', names);

  // filter — กรองตามเงื่อนไข
  const inStock = products.filter((p) => p.stock > 0);
  console.log('  filter inStock:', inStock.length, 'รายการ');

  // find — หาตัวแรกที่ตรงเงื่อนไข
  const mango = products.find((p) => p.name === 'มะม่วง');
  console.log('  find mango:', mango?.name);

  // findIndex — หา index
  const idx = products.findIndex((p) => p.id === '2');
  console.log('  findIndex ทุเรียน:', idx);

  // some / every
  const hasOutOfStock = products.some((p) => p.stock === 0);
  const allFruit = products.every((p) => p.category === 'fruit');
  console.log('  some outOfStock:', hasOutOfStock);
  console.log('  every fruit:', allFruit);

  // reduce — รวมค่า
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  console.log('  reduce totalValue:', totalValue);

  // sort — เรียงลำดับ (spread ก่อนเพื่อไม่ mutate ต้นฉบับ)
  const byPrice = [...products].sort((a, b) => a.price - b.price);
  console.log(
    '  sort byPrice:',
    byPrice.map((p) => `${p.name}(${p.price})`).join(', '),
  );

  // chain หลาย method
  const cheapFruits = products
    .filter((p) => p.category === 'fruit')
    .filter((p) => p.price < 100)
    .map((p) => p.name);
  console.log('  chain cheapFruits:', cheapFruits);
}
