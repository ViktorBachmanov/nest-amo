const fs = require('fs');
const https = require('https');

import { AsyncHttpsResponse } from './types';

export function asyncHttpsRequest(urlPath: string, method: string, data: any) {
  const urlPrefix = 'https://vbachmanovmailru.amocrm.ru/';

  const url = urlPrefix + urlPath;

  return new Promise((resolve, reject) => {
    const tokens = fs.readFileSync('private/file.txt', 'utf8');
    const accessToken = JSON.parse(tokens).access_token;

    const options = {
      //url: urlPrefix + urlPath,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const callback = function (res) {
      var str = '';
      res.on('data', function (chunk) {
        str += chunk;
      });

      res.on('end', function () {
        console.log('Response end: ');
        console.log('Status code: ', res.statusCode);
        console.log('Headers: ', res.headers);
        console.log(str);

        const response: AsyncHttpsResponse = {
          statusCode: res.statusCode,
          str,
        };

        resolve(response);
      });

      res.on('error', function (err) {
        reject(err.message);
      });
    };

    const req = https.request(url, options, callback);

    console.log('asyncHttpsRequest options: ', options);
    console.log('asyncHttpsRequest data: ', data);

    req.write(JSON.stringify(data));
    req.end();
  });
}

export function saveTokens(response: string) {
  const resBody = JSON.parse(response);
  const expires_in = resBody.expires_in;
  resBody.timeToRefresh = Date.now() + (expires_in - 60 * 5) * 1000;

  fs.writeFileSync('private/file.txt', JSON.stringify(resBody));
}
