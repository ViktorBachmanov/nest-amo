import { Injectable } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';

const https = require('https');
const fs = require('fs');

require('dotenv').config();

import { saveTokens, requestTokens } from './util';
import { AsyncHttpsResponse, GrantType } from './types';

@Injectable()
export class AppService {
  private code: string;
  getCode(req: Request) {
    console.log('Code: ', req.query.code);

    this.code = req.query.code as string;
    return this.code;
  }

  async getTokens() {
    console.log('getTokens');

    const response: AsyncHttpsResponse = await requestTokens(
      GrantType.Authorization,
      this.code,
    );

    if (response.statusCode === 200) {
      console.log('Токен доступа успешно получен');
      saveTokens(response.str);
    }
  }
}
