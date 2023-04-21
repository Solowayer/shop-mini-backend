import { Module } from '@nestjs/common';
import { SellerDashboardService } from './seller-dashboard.service';
import { SellerDashboardController } from './seller-dashboard.controller';

@Module({
  controllers: [SellerDashboardController],
  providers: [SellerDashboardService]
})
export class SellerDashboardModule {}
