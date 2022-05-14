import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Query,
  Res,
} from '@nestjs/common';
import { response } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

import FreshContact from './FreshContact';
import { AsyncHttpsResponse } from '../types';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // @Post()
  // create(@Body() createContactDto: CreateContactDto) {
  //   return this.contactService.create(createContactDto);
  // }

  // @Get()
  // findAll() {
  //   return this.contactService.findAll();
  // }

  @Get()
  @Render('contact')
  showForm() {
    // return {
    //   sendContact: (e: any) => {
    //     e.preventDefault();
    //     console.log('sendContact');
    //   },
    // };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.contactService.findOne(+id);
  // }

  @Get('process')
  async process(@Query() query: any) {
    //return this.contactService.findOne(query);
    const contact = await this.contactService.findOne(query);

    let freshContact: FreshContact;
    let response: AsyncHttpsResponse;
    let contactId: number;

    if (contact) {
      freshContact = new FreshContact(query, contact);
      console.log('freshContact.data: ', freshContact.data);
      console.log(
        'freshContact.data.values: ',
        freshContact.data.custom_fields_values[0].values,
      );
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

    // freshContact.setCustomField('PHONE');
    // console.log('FreshContact: ', freshContact);
    // console.log(
    //   'custom_fields_values: ',
    //   freshContact.data.custom_fields_values,
    // );
    // console.log(
    //   'custom_fields_values_values: ',
    //   freshContact.data.custom_fields_values[0].values,
    // );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
  //   return this.contactService.update(+id, updateContactDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.contactService.remove(+id);
  // }
}
