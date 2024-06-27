import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddOnServiceController } from './controller/addOn.controller';
import { AddOnServices } from './service/addOn.service';
import { AddOnService } from './entity/addOnService.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddOnService])],
  controllers: [AddOnServiceController],
  providers: [AddOnServices]
})
export class AddOnModule {}
