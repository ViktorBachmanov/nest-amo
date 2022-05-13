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

  constructor(query: any, data = {} as ContactData) {
    this.query = query;
    this.data = data;

    this.setName();
  }

  setName() {
    this.data.name = this.query.name;
  }

  setCustomField(fieldName: string) {
    const field = this.data.custom_fields_values?.find((field) => {
      return field.field_code === fieldName;
    });

    const newCustomFieldValue = { value: this.query[fieldName] };

    if (field) {
      field.values.push({ value: this.query[fieldName] });
    } else {
      this.data.custom_fields_values = [];
      this.data.custom_fields_values.push({
        field_code: fieldName,
        values: [{ value: this.query[fieldName] }],
      });
    }
  }
}
