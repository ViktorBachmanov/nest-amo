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

@Controller('contact')
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
  async process(@Query() query: any, @Res() response: any) {
    //return this.contactService.findOne(query);
    const contact = await this.contactService.findOne(query);

    let freshContact: FreshContact;
    if (contact) {
      freshContact = new FreshContact(query, contact);
      this.contactService.update(freshContact);
    } else {
      freshContact = new FreshContact(query);
      this.contactService.create(freshContact);
    }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
