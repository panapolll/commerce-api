import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {
    console.log('🔥 WalletController LOADED');
  }

  @Get(':userId/balance')
  getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }
  @Post('create')
  createWallet(@Body('userId') userId: string) {
    return this.walletService.createWallet(userId);
  }

  @Post('deposit')
  deposit(@Body('userId') userId: string, @Body('amount') amount: number) {
    return this.walletService.deposit(userId, amount);
  }

  @Post('withdraw')
  withdraw(@Body('userId') userId: string, @Body('amount') amount: number) {
    return this.walletService.withdraw(userId, amount);
  }

  @Post('transfer')
  transfer(
    @Body('fromUserId') fromUserId: string,
    @Body('toUserId') toUserId: string,
    @Body('amount') amount: number,
  ) {
    return this.walletService.transfer(fromUserId, toUserId, amount);
  }
}
