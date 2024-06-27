import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Membership } from './membership/entity/membership.entity';
import { AddOnService } from './addOnServices/entity/addOnService.entity';
import { CronJobService } from './cronServices/cron-job.service';
import { WinstonLoggerService } from './logging/logger';
// import { AuthModule } from './auth/auth.module';
import { AddOnModule } from './addOnServices/addOn.module';
import { MembershipModule } from './membership/membership.module';

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
    AddOnModule,
    MembershipModule
  ],
  controllers: [],
  providers: [CronJobService, WinstonLoggerService],
})


export class AppModule {}
