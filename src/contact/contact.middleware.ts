import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { asyncHttpsRequest, saveTokens, createTokensPayload } from '../util';
import { AsyncHttpsResponse, GrantType } from '../types';

const fs = require('fs');

require('dotenv').config();

@Injectable()
export class ContactMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('ContactMiddleware');

    const data = fs.readFileSync('private/file.txt', 'utf8');
    const { timeToRefresh, refresh_token } = JSON.parse(data);

    if (timeToRefresh < Date.now()) {
      try {
        const response: AsyncHttpsResponse = await asyncHttpsRequest(
          'oauth2/access_token',
          'POST',
          // {
          //   client_id: process.env.CLIENT_ID,
          //   client_secret: process.env.CLIENT_SECRET,
          //   grant_type: 'refresh_token',
          //   refresh_token,
          //   redirect_uri: process.env.REDIRECT_URI,
          // },
          createTokensPayload(GrantType.Refresh, refresh_token),
        );

        if (response.statusCode === 200) {
          console.log('Токен доступа успешно обновлен');
          saveTokens(response.str);
        }
      } catch {
        res.write('Refresh token error');
        res.end();
      }
    }

    next();
  }
}
