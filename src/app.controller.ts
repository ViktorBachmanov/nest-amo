import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getCode(@Req() req: Request, @Res() res: Response) {
    console.log('Controller auth getCode()');
    //const code = this.appService.getCode(req);
    this.appService.getCode(req);

    //await this.appService.getTokensAsync();
    try {
      this.appService.getTokens();
    } catch (e) {
      res.write(e);
      res.end();
    }

    //return code;
  }
}
