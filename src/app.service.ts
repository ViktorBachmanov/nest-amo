import { Injectable } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';

var http = require('http');
var os = require('os');

@Injectable()
export class AppService {
  private code: string;
  // getHello(): string {
  //   return 'Hello World!';
  // }
  getCode(req: Request) {
    //console.log('Headers: ', JSON.stringify(req.headers));
    console.log('Code: ', req.query.code);

    this.code = req.query.code as string;
    //return { code: JSON.stringify(req.headers) };
    return this.code;
  }

  getTokens() {
    //console.log('host: ', os.hostname());

    const options = {
      //host: 'vbachmanovmailru.amocrm.ru',
      //path: '/oauth2/access_token',
      //protocol: 'http:',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'amoCRM-oAuth-client/1.0',
      },
    };

    const callback = function (response) {
      //response.setHeader('Content-Type', 'application/json');
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log('response end: ');
        console.log(str);
      });
    };

    const url = 'https://vbachmanovmailru.amocrm.ru/oauth2/access_token';
    const req = http.request(url, options, callback);

    req.write(
      JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: this.code,
        redirect_uri: process.env.REDIRECT_URI,
      }),
    );

    req.end();
  }
}
