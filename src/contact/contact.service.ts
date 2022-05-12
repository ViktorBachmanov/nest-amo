import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

const https = require('https');
const fs = require('fs');

@Injectable()
export class ContactService {
  create(createContactDto: CreateContactDto) {
    return 'This action adds a new contact';
  }

  findAll() {
    return `This action returns all contact`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} contact`;
  // }
  findOne(query: any) {
    console.log('Handle request');

    getAllContacts();

    //return `This action returns the contact and ${query.add}`;
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}

// helper functions

function getAllContacts() {
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
      console.log('Contacts: ', contacts);
      contacts.forEach((contact) => {
        const customFields = contact.custom_fields_values;
        console.log('\ncustom_fields_values: ', customFields);
        if (customFields) {
          customFields.forEach((field) => {
            console.log(field.values);
          });
        }
      });
    });
  };

  const url = 'https://vbachmanovmailru.amocrm.ru/api/v4/contacts';
  const req = https.request(url, options, callback);

  // req.write(
  //   JSON.stringify({
  //     with: 'leads',
  //   }),
  // );
  req.end();
}
