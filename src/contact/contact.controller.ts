import { Controller, Get, Render, Query } from '@nestjs/common';
import { ContactService } from './contact.service';

import FreshContact from './FreshContact';
import { AsyncHttpsResponse } from '../types';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Render('contact')
  showForm() {}

  @Get('process')
  async process(@Query() query: any) {
    const contact = await this.contactService.findOne(query);

    let freshContact: FreshContact;
    let response: AsyncHttpsResponse;
    let contactId: number;

    if (contact) {
      freshContact = new FreshContact(query, contact);
      //console.log('freshContact.data: ', freshContact.data);
      // console.log(
      //   'freshContact.data.values: ',
      //   freshContact.data.custom_fields_values[0].values,
      // );
      response = await this.contactService.update(freshContact.data);
      if (response.statusCode !== 200) {
        return 'Не удалось обновить контакт';
      }
      console.log('Контакт успешно обновлен');
      contactId = JSON.parse(response.str)._embedded.contacts[0].id;
    } else {
      freshContact = new FreshContact(query);
      console.log('freshContact.data: ', freshContact.data);
      console.log(
        'freshContact.data.values: ',
        freshContact.data.custom_fields_values[0].values,
      );
      response = await this.contactService.create(freshContact.data);
      if (response.statusCode !== 200) {
        return 'Не удалось создать контакт';
      }
      console.log('Контакт успешно создан');
      contactId = JSON.parse(response.str)._embedded.contacts[0].id;
    }
    console.log('Conact_id: ', contactId);

    response = await this.contactService.createLead(contactId);
    return response.statusCode === 200
      ? 'Сделка создана успешно'
      : 'Не удалось создать сделку';
  }
}
