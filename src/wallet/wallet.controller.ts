import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  getBalance(@Req() req) {
    return this.walletService.getBalance(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createWallet(@Req() req) {
    return this.walletService.createWallet(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  deposit(@Req() req, @Body('amount') amount: number) {
    return this.walletService.deposit(req.user.id, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  withdraw(@Req() req, @Body('amount') amount: number) {
    return this.walletService.withdraw(req.user.id, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  transfer(
    @Req() req,
    @Body('toUserId') toUserId: string,
    @Body('amount') amount: number,
  ) {
    return this.walletService.transfer(req.user.id, toUserId, amount);
  }
}