import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipController } from './controller/membership.controller';
import { MembershipService } from './service/membership.service';
import { Membership } from './entity/membership.entity';
import { AddOnService } from 'src/addOnServices/entity/addOnService.entity';
import { PaystackService } from 'src/paystackService/paystack.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, AddOnService])],
  controllers: [MembershipController],
  providers: [MembershipService, PaystackService]
})
export class MembershipModule {}
