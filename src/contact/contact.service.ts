import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

//import got, { Options } from 'got';

const https = require('https');
const fs = require('fs');

interface AsyncHttpsResponse {
  statusCode: number;
  body: string;
}

@Injectable()
export class ContactService {
  // create(createContactDto: CreateContactDto) {
  //   return 'This action adds a new contact';
  // }
  create(contact: any) {
    console.log('Create: ');

    asyncHttpsRequest('api/v4/contacts', 'POST', [contact]);

    //return 'This action adds a new contact';
  }

  findAll() {
    return `This action returns all contact`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} contact`;
  // }
  async findOne(query: any) {
    console.log('Handle request');

    // const allContacts: Array<any> = await new Promise((resolve, reject) => {
    //   getAllContacts(resolve, reject);
    // });

    // console.log('All contacts: ', allContacts);
    // allContacts.forEach((contact) => {
    //   const customFields = contact.custom_fields_values;
    //   console.log('\ncustom_fields_values: ', customFields);

    //   if (!customFields) {
    //     return;
    //   }

    //   customFields.forEach((field) => {
    //     console.log(field.values);
    //   });

    //   const compareResult = customFields.some((field) => {
    //     console.log('field_code: ', field.field_code);
    //     return field.values.some((valueObj) => {
    //       console.log('field_value: ', valueObj.value);
    //       console.log('query_value: ', query[field.field_code]);
    //       return valueObj.value === query[field.field_code];
    //     });
    //   });
    //   console.log('compareResult: ', compareResult);
    // });

    const response: any = await findContactByQueryParam(query['PHONE']);

    return response.statusCode === 200 ? JSON.parse(response.body) : null;

    //return `This action returns the contact and ${query.add}`;
  }

  // update(id: number, updateContactDto: UpdateContactDto) {
  //   return `This action updates a #${id} contact`;
  // }
  update(contact: any) {
    //return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}

// helper functions

async function getAllContacts(resolve, reject) {
  console.log('\ngetAllContacts: \n');

  const data = fs.readFileSync('private/file.txt', 'utf8');
  const accessToken = JSON.parse(data).access_token;

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

      resolve(contacts);
    });
  };

  const url = 'https://vbachmanovmailru.amocrm.ru/api/v4/contacts';
  const req = https.request(url, options, callback);

  req.end();
}

function findContactByQueryParam(paramValue: string) {
  console.log('\nfindContactByQueryParam: \n');

  return new Promise((resolve, reject) => {
    const data = fs.readFileSync('private/file.txt', 'utf8');
    const accessToken = JSON.parse(data).access_token;

    const options = {
      method: 'GET',
      headers: {
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

        // const resBody = JSON.parse(str);
        // const contacts = resBody._embedded.contacts;

        const response: AsyncHttpsResponse = {
          statusCode: res.statusCode,
          body: str,
        };

        resolve(response);
      });

      res.on('error', function (err) {
        reject(err.message);
      });
    };

    const url = `https://vbachmanovmailru.amocrm.ru/api/v4/contacts?query=${paramValue}`;
    const req = https.request(url, options, callback);

    req.end();
  });
}

function asyncHttpsRequest(urlPath: string, method: string, data: any) {
  const urlPrefix = 'https://vbachmanovmailru.amocrm.ru/';

  return new Promise((resolve, reject) => {
    const data = fs.readFileSync('private/file.txt', 'utf8');
    const accessToken = JSON.parse(data).access_token;

    const options = {
      url: urlPrefix + urlPath,
      method,
      headers: {
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
          body: str,
        };

        resolve(str);
      });

      res.on('error', function (err) {
        reject(err.message);
      });
    };

    const req = https.request(options, callback);

    req.write(JSON.stringify(data));
    req.end();
  });
}
