import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProductsService } from './products/products.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);

  // สร้าง admin
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'กรุณาตั้งค่า SEED_ADMIN_EMAIL และ SEED_ADMIN_PASSWORD ใน .env ก่อนรัน seed',
    );
  }

  let adminId: string;

  try {
    const existing = await usersService.findByEmail(email);
    adminId = String(existing._id);
    console.log('✅ Admin already exists');
  } catch (e) {
    const admin = await usersService.createUser(email, password, 'admin');
    adminId = String(admin._id);
    console.log('🔥 Admin created');
  }

  // ลบ duplicate ก่อน seed
  const allProducts = await productsService.findAll();
  const seen = new Map<string, string>(); // name → _id

  for (const product of allProducts) {
    const id = String(product._id);
    if (seen.has(product.name)) {
      // มีแล้ว ลบอันนี้ทิ้ง (เก็บอันแรกไว้)
      await productsService.delete(id);
      console.log(`🗑️ Deleted duplicate: ${product.name} (${id})`);
    } else {
      seen.set(product.name, id);
    }
  }

  // เช็ค products ที่มีอยู่แล้ว (หลังลบ duplicate)
  const existingProducts = await productsService.findAll();
  const existingNames = existingProducts.map((p) => p.name);

  const products = [
    {
      name: 'มังคุด',
      description: 'มังคุด กินแล้วฟันไม่คุด แต่ถ้ากินเยอะก็ไม่แน่ ไม่ใช่ฟันคุดนะ จะอ้วน',
      price: 50,
      stock: 100,
      category: 'fruit',
    },
    {
      name: 'ทุเรียน',
      description: 'ทุเรียน กลิ่นสุดเอียนที่สวยลุงศักดิ์ ใครจะกินก็กิน ผมไม่กิน',
      price: 500,
      stock: 30,
      category: 'fruit',
    },
    {
      name: 'มะม่วง',
      description: 'มะม่วงสีแดง พันธ์ใหม่ในส่วนป้าหน่อย อร่อยถูกใจ อนามัยถูกลืม แต่ไม่มีใครปลิ้ม แต่ป้าก็ยังขายต่อ',
      price: 80,
      stock: 200,
      category: 'fruit',
    },
    {
      name: 'ลำไย',
      description: 'ลำไยสุดหวาน หวานเรียกพ่อ ขมเรียกพี่ แต่อย่ากินดีกว่า ',
      price: 60,
      stock: 150,
      category: 'fruit',
    },
    {
      name: 'เงาะ',
      description: 'เงาะโรงแรม พันธ์ใหม่ในประเทศไทย ใครจะกินก็กินก็กิน ผมไม่กิน',
      price: 40,
      stock: 120,
      category: 'fruit',
    },
    {
      name: 'แก้วมังกร',
      description: 'แก้วมังกรแสนอร่อย กินบ่อยๆ อาจจะติดใจ นานๆ ไปอาจติดเตียง',
      price: 40,
      stock: 120,
      category: 'fruit',
    },
  ];

  for (const product of products) {
    if (existingNames.includes(product.name)) {
      console.log(`⏭️ Skip: ${product.name} มีอยู่แล้ว`);
      continue;
    }
    await productsService.create(product, adminId);
    console.log(`🌱 Created product: ${product.name}`);
  }

  console.log('✅ Seed completed!');
  await app.close();
}

bootstrap();
