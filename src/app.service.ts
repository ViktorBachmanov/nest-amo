import { Injectable } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';

var https = require('https');
//var os = require('os');
require('dotenv').config();

@Injectable()
export class AppService {
  private account: string = 'https://vbachmanovmailru.amocrm.ru';
  private code: string;
  private accessToken: string;
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

  getTokensAsync() {
    return new Promise((resolve, reject) => {
      this.getTokens(resolve, reject);
    });
  }

  getTokens(resolve: any, reject: any) {
    //console.log('host: ', os.hostname());
    //console.log('CLIENT_ID: ', process.env.CLIENT_ID);

    const options = {
      //host: 'vbachmanovmailru.amocrm.ru',
      //path: '/oauth2/access_token',
      //protocol: 'http:',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'User-Agent': 'amoCRM-oAuth-client/1.0',
      },
    };

    const self = this;

    const callback = function (response) {
      console.log('Headers: ', response.headers);
      //response.setHeader('Content-Type', 'application/json');
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log('response end this: ', self);
        console.log(str);

        const resBody = JSON.parse(str);
        self.accessToken = resBody.access_token;

        console.log('\nAccess-Token: ', self.accessToken);

        resolve(resBody);
      });
    };

    const url = 'https://vbachmanovmailru.amocrm.ru/oauth2/access_token';
    const req = https.request(url, options, callback);

    req.on('error', (e) => {
      console.log('Error: ', e.message);

      reject(e);
    });

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

  getAllContacts() {
    console.log('\ngetAllContacts: \n');
    console.log(`\nthis.accessToken: ${this.accessToken}\n`);

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    const callback = function (response) {
      console.log('Headers: ', response.headers);
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log('response end: ');
        //console.log(str);

        const resBody = JSON.parse(str);
        const contacts = resBody._embedded.contacts;
        console.log('Contacts: ', contacts);
        contacts.forEach((contact) => {
          console.log('\nLeads: ', contact._embedded.leads);
        });
      });
    };

    const url = 'https://vbachmanovmailru.amocrm.ru/api/v4/contacts?with=leads';
    const req = https.request(url, options, callback);

    // req.write(
    //   JSON.stringify({
    //     with: 'leads',
    //   }),
    // );
    req.end();
  }

  createContacts() {
    console.log('\ncreateContact:\n');

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    const callback = function (response) {
      console.log('Headers: ', response.headers);
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log('response end');
        console.log(str);

        const resBody = JSON.parse(str);
      });
    };

    const url = `${this.account}/api/v4/contacts`;
    const req = https.request(url, options, callback);

    req.on('error', (e) => {
      console.log('Error: ', e.message);
    });

    const contacts = [
      {
        first_name: 'Петр',
        last_name: 'Смирнов',
      },
    ];

    req.write(JSON.stringify(contacts));

    req.end();
  }
}
