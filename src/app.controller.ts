import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getCode(@Req() req: Request, @Res() res: Response) {
    console.log('Controller auth getCode()');
    this.appService.getCode(req);

    try {
      this.appService.getTokens();
    } catch (e) {
      res.write(e);
      res.end();
    }
  }
}
