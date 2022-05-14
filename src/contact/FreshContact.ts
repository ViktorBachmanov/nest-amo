interface CustomFieldsValues {
  [index: string]: any;
  values: Array<any>;
}

interface ContactData {
  [index: string]: any;
  custom_fields_values: Array<CustomFieldsValues>;
}

export default class FreshContact {
  private query: any;
  public data: ContactData;

  constructor(query: any, data: ContactData | null = null) {
    this.query = query;
    this.data = data;

    if (!data) {
      this.data = {} as ContactData;
      this.data.custom_fields_values = [];
    }

    this.setName();
    this.setCustomField('EMAIL');
    this.setCustomField('PHONE');
  }

  setName() {
    this.data.name = this.query.name;
    [this.data.first_name, this.data.last_name] = this.query.name.split(' ');
  }

  setCustomField(fieldName: string) {
    const field = this.data.custom_fields_values.find((field) => {
      return field.field_code === fieldName;
    });

    const newCustomFieldValue = { value: this.query[fieldName] };

    if (field) {
      const isValueExist = field.values.some(
        (elem) => elem.value === this.query[fieldName],
      );
      if (!isValueExist) {
        field.values.push(newCustomFieldValue);
      }
    } else {
      this.data.custom_fields_values.push({
        field_code: fieldName,
        values: [newCustomFieldValue],
      });
    }
  }
}
