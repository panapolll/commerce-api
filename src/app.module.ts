import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const uri =
          config.get<string>('MONGO_URI') ?? config.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error(
            'ไม่พบ MONGO_URI ใน .env — copy .env.example แล้วใส่ connection string',
          );
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
  ],
})
export class AppModule {}
