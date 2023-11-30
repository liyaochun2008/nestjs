import { NestFactory ,} from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  app.useStaticAssets(join(__dirname, '..'));
  app.setBaseViewsDir(join(__dirname, '..'))
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
