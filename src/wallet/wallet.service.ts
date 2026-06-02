import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Wallet } from './schema/wallet.schema';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionType } from './schema/transaction.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>,

    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}
  async createWallet(userId: string) {
    return this.walletModel.create({
      userId: new Types.ObjectId(userId),
      balance: 0,
    });
  }

  async getBalance(userId: string) {
    const wallet = await this.walletModel.findOne({
      userId,
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async deposit(userId: string, amount: number) {
    const wallet = await this.walletModel.findOne({
      userId,
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balance += amount;

    await wallet.save();

    await this.transactionModel.create({
      fromUserId: wallet.userId,
      amount,
      type: TransactionType.DEPOSIT,
    });

    return wallet;
  }

  async withdraw(userId: string, amount: number) {
    const wallet = await this.walletModel.findOne({
      userId,
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance -= amount;

    await wallet.save();

    await this.transactionModel.create({
      fromUserId: wallet.userId,
      amount,
      type: TransactionType.WITHDRAW,
    });

    return wallet;
  }

  async transfer(fromUserId: string, toUserId: string, amount: number) {
    const senderWallet = await this.walletModel.findOne({
      userId: fromUserId,
    });

    const receiverWallet = await this.walletModel.findOne({
      userId: toUserId,
    });

    if (!senderWallet) {
      throw new NotFoundException('Sender wallet not found');
    }

    if (!receiverWallet) {
      throw new NotFoundException('Receiver wallet not found');
    }

    if (senderWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    await this.transactionModel.create({
      fromUserId: senderWallet.userId,
      toUserId: receiverWallet.userId,
      amount,
      type: TransactionType.TRANSFER,
    });

    return {
      senderBalance: senderWallet.balance,
      receiverBalance: receiverWallet.balance,
    };
  }
}
