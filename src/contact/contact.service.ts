import { Injectable } from '@nestjs/common';

import { asyncHttpsRequest } from '../util';

const https = require('https');
const fs = require('fs');

@Injectable()
export class ContactService {
  create(contact: any) {
    console.log('Create: ');

    return asyncHttpsRequest('api/v4/contacts', 'POST', [contact]);
  }

  async findOne(query: any) {
    console.log('findOne()');

    let response: any = await findContactByQueryParam(query['EMAIL']);

    if (response.statusCode !== 200) {
      response = await findContactByQueryParam(query['PHONE']);
    }

    return response.statusCode === 200
      ? JSON.parse(response.str)._embedded.contacts[0]
      : null;
  }

  update(contact: any) {
    console.log('Update: ');

    return asyncHttpsRequest('api/v4/contacts', 'PATCH', [contact]);
  }

  createLead(contactId: number) {
    console.log('Lead creating...');

    const lead = {
      name: 'Сделка выгодная',
      _embedded: {
        contacts: [
          {
            id: contactId,
          },
        ],
      },
    };

    return asyncHttpsRequest('api/v4/leads', 'POST', [lead]);
  }
}

// helper functions

function findContactByQueryParam(paramValue: string) {
  console.log('findContactByQueryParam()');

  return asyncHttpsRequest(`api/v4/contacts?query=${paramValue}`, 'GET');
}
