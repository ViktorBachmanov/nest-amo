import { Controller, Get, Post, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@Render('index')
  //index() {}
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  async getCode(@Req() req: Request) {
    console.log('Controller getCode()');
    const code = this.appService.getCode(req);

    await this.appService.getTokensAsync();
    

    //this.appService.createContacts();

    this.appService.getAllContacts();

    return code;
  }
}
