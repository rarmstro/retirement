import Ajv from 'ajv';

import { traverseJsonPath, resolveRef, resolveSchema } from "../JSONUtils";
import testData from "../../../test/testData.json";
import testSchema from "../../../test/testSchema.json";

describe("verifySchema", () => {
  it("should validate JSON data against schema", () => {
    const ajv = new Ajv({ useDefaults: true });
    const validate = ajv.compile(testSchema);
    expect(validate(testData)).toBe(true);
  });
});

describe("resolveRef", () => {
  it("should resolve $ref ", () => {
    expect(resolveRef(testSchema, "#/$defs/address")).toEqual(
      testSchema.$defs.address
    );
    expect(resolveRef(testSchema, "#/$defs/preferences")).toEqual(
      testSchema.$defs.preferences
    );
    expect(resolveRef(testSchema, "#/$defs/theme")).toEqual(
      testSchema.$defs.theme
    );
  });
});

describe("traverseJsonPath", () => {
  it("should traverse JSON object using dot notation path", () => {
    expect(traverseJsonPath(testData, "$.name").value).toBe(testData.name);
    expect(traverseJsonPath(testData, "$.addresses[0].street").value).toBe(
      testData.addresses[0].street
    );
    expect(traverseJsonPath(testData, "$.addresses[1].city").value).toBe(
      testData.addresses[1].city
    );
    expect(traverseJsonPath(testData, "$.preferences.favourites[1]").value).toBe(
      testData.preferences.favourites[1]
    );
    expect(traverseJsonPath(testData, "$.user.invalid").exists).toBe(false);
    expect(traverseJsonPath(testData, "$.invalid.path").exists).toBe(false);
  });
});

describe("resolveSchema", () => { 
  it("should resolve schema using dot notation path", () => {
    expect(resolveSchema(testSchema, "$").value).toEqual(testSchema);
  

    expect(resolveSchema(testSchema, "$.addresses[0].street").value).toEqual(
      testSchema.$defs.address.properties.street
    );
    expect(resolveSchema(testSchema, "$.tags[2]").value).toEqual(
      testSchema.properties.tags.items
    );
    expect(resolveSchema(testSchema, "$.name").value).toEqual(
      testSchema.properties.name
    );
    expect(resolveSchema(testSchema, "$.preferences.theme").value).toEqual(
      testSchema.$defs.theme
    );
    expect(resolveSchema(testSchema, "$.preferences.notifications").value).toEqual(
      testSchema.$defs.preferences.properties.notifications
    );
    expect(resolveSchema(testSchema, "$.preferences.favorites[3]").value).toEqual(
      testSchema.$defs.favorite 
    );
  });
});