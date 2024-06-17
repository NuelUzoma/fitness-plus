import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Membership } from './database/membership.entity';
import { AddOnService } from './database/addOnService.entity';
import { MembershipController } from './controllers/membership.controller';
import { AddOnServiceController } from './controllers/addOn.controller';
import { MembershipService } from './services/membership.service';
import { AddOnServices } from './services/addOn.service';
import { CronJobService } from './services/cron-job.service';
import { WinstonLoggerService } from './logging/logger';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration available globally
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Membership, AddOnService],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Membership, AddOnService]),
    ScheduleModule.forRoot(),
    // AuthModule,
  ],
  controllers: [MembershipController, AddOnServiceController],
  providers: [MembershipService, AddOnServices, CronJobService, WinstonLoggerService],
})
export class AppModule {}
