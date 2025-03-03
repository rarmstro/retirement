import Ajv from 'ajv';
import schema from './schema.json';

const ajv = new Ajv({ useDefaults: true });

const validate = ajv.compile(schema);

export const validateData = (data: any) => {
  const valid = validate(data);
  if (!valid) {
    console.error('Invalid JSON data:', validate.errors);
  }
  return valid;
};
