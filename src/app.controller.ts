import { Controller, Get, Post, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@Render('index')
  //index() {}
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  getCode(@Req() req: Request) {
    const code = this.appService.getCode(req);

    this.appService.getTokens();

    return code;
  }
}
