import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocuments } from './schema/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './DTO/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocuments>,
  ) {}

  async findAll() {
    return this.productModel.find({ isActive: true });
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    console.log('Found product:', product);
    return product;
  }

  async create(data: CreateProductDto, userId: string) {
    const newProduct = new this.productModel({ ...data, createdBy: userId });
    console.log('Created product:', newProduct);
    return newProduct.save();
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!product) throw new NotFoundException('Product not found');
    console.log('Updated product:', product);
    return product;
  }

  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    console.log('Deleted product:', product);
    return { message: 'Product deleted' };
  }

  // เพิ่มใหม่: ลบทุก document ที่ชื่อซ้ำกัน
  async deleteByName(name: string) {
    await this.productModel.deleteMany({ name });
  }

  async decreaseStock(id: string, quantity: number) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) {
      throw new BadRequestException('สินค้าไม่เพียงพอ');
    }
    product.stock -= quantity;
    return product.save();
  }

  async increaseStock(id: string, quantity: number) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    product.stock += quantity;
    return product.save();
  }
}
