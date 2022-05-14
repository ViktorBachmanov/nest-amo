import { Injectable } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';

const https = require('https');
const fs = require('fs');

require('dotenv').config();

import { asyncHttpsRequest, saveTokens, createTokensPayload } from './util';
import { AsyncHttpsResponse, GrantType } from './types';

@Injectable()
export class AppService {
  private code: string;
  getCode(req: Request) {
    console.log('Code: ', req.query.code);

    this.code = req.query.code as string;
    return this.code;
  }

  // getTokensAsync() {
  //   return new Promise((resolve, reject) => {
  //     this.getTokens(resolve, reject);
  //   });
  // }

  async getTokens() {
    console.log('getTokens');
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // };

    // const callback = function (response) {
    //   console.log('Headers: ', response.headers);
    //   var str = '';
    //   response.on('data', function (chunk) {
    //     str += chunk;
    //   });

    //   response.on('end', function () {
    //     console.log(str);

    //     saveTokens(str);

    //     resolve();
    //   });
    // };

    // const url = 'https://vbachmanovmailru.amocrm.ru/oauth2/access_token';
    // const req = https.request(url, options, callback);

    // req.on('error', (e) => {
    //   console.log('Error: ', e.message);

    //   reject(e);
    // });

    // req.write(
    //   JSON.stringify({
    //     client_id: process.env.CLIENT_ID,
    //     client_secret: process.env.CLIENT_SECRET,
    //     grant_type: 'authorization_code',
    //     code: this.code,
    //     redirect_uri: process.env.REDIRECT_URI,
    //   }),
    // );

    // req.end();

    const response: AsyncHttpsResponse = await asyncHttpsRequest(
      'oauth2/access_token',
      'POST',
      createTokensPayload(GrantType.Authorization, this.code),
    );

    if (response.statusCode === 200) {
      console.log('Токен доступа успешно получен');
      saveTokens(response.str);
    }
  }
}
