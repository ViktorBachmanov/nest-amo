import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

import { ContactMiddleware } from './contact.middleware';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContactMiddleware).forRoutes('contact/process');
  }
}
