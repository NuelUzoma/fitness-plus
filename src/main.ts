import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './logging/logger';
import { logger } from './logging/logger';
import { morganMiddleware } from './middlewares/morgan.middleware';
import { HttpExceptionFilter } from './middlewares/httpException.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(new WinstonLoggerService());

  app.use(morganMiddleware);
  
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  await app.listen(3000);
}

bootstrap();
