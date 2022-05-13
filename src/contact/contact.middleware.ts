import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { asyncHttpsRequest, saveTokens } from '../util';
import { AsyncHttpsResponse } from '../types';

const fs = require('fs');

require('dotenv').config();

@Injectable()
export class ContactMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('ContactMiddleware');
    //req.query.add = 'Доп. параметр';

    const data = fs.readFileSync('private/file.txt', 'utf8');
    const { timeToRefresh, refresh_token } = JSON.parse(data);

    if (timeToRefresh < Date.now()) {
      const response: any = await asyncHttpsRequest(
        'oauth2/access_token',
        'POST',
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token,
          redirect_uri: process.env.REDIRECT_URI,
        },
      );

      if (response.statusCode === 200) {
        saveTokens(response.str);
      }
    }

    // res.writeHead(200, { 'content-type': 'application/json' });
    // res.write(JSON.stringify({ test: 'end response' }));
    // res.end();

    next();
  }
}
