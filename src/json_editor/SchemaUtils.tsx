import React from "react";
import SchemaObject from "./SchemaObject";
import SchemaBoolean from "./SchemaBoolean";
import SchemaString from "./SchemaString";
import SchemaArray from "./SchemaArray";
import SchemaNumber from "./SchemaNumber";

export const resolveRef = (ref: string, schema: Record<string, any>) => {
  const refPath = ref.slice(2).split("/");
  let resolvedRef = schema;
  for (const key of refPath) {
    if (resolvedRef[key]) {
      resolvedRef = resolvedRef[key];
    } else {
      throw new Error(`Invalid $ref: ${ref}`);
    }
  }
  return resolvedRef;
};

// Function to find the schema object based on the JSON path provided
export const resolveSchema = (schema: Record<string, any>, path: string) => {
  //console.log("Path = ", path, schema);
  let currentSchema = schema;

  // Split the path into an array of keys
  const pathKeys = path.split(".");

  let key = pathKeys[0];

  while (pathKeys.length > 1) {
    //console.log("Current key = ", key);

    //console.log(pathKeys);

    // Extract everything before the first "[" character, or the entire string if there is no "["
    key = pathKeys[1].split("[")[0];

    //console.log("Child key = ", key);

    while (currentSchema["type"] === "array" && currentSchema["items"]) {
      console.log("Handling array type");
      currentSchema = currentSchema["items"];

      // Check if there is a $ref at the current level of the schema
      if (currentSchema["$ref"]) {
        //console.log("Resolving $ref");
        currentSchema = resolveRef(currentSchema["$ref"], schema);
      }
    }

    if (
      currentSchema["type"] === "object" &&
      currentSchema["properties"] &&
      currentSchema["properties"][key]
    ) {
      currentSchema = currentSchema["properties"][key];
      //console.log("Handling object type");
    }

    // Check if there is a $ref at the current level of the schema
    while (currentSchema["$ref"]) {
      //console.log("Resolving $ref");
      currentSchema = resolveRef(currentSchema["$ref"], schema);
    }

    pathKeys.shift();
  }
  //console.log(currentSchema);
  return currentSchema;
};

// 🔹 Helper function to render schema components based on type
export const renderSchemaType = (
  schema: Record<string, any>,
  path: string,
  getJson: () => Record<string, any>,
  updateJson: (path: string, value: any) => void
) => {
  // Split the path into an array of keys
  const resolvedSchema = resolveSchema(schema, path);
  const json = getJson();

  switch (resolvedSchema["type"]) {
    case "object":
      return (
        <SchemaObject
          schema={schema}
          path={path}
          getJson={getJson}
          updateJson={updateJson}
        />
      );
    case "string":
      return (
        <SchemaString
          schema={schema}
          path={path}
          getJson={getJson}
          updateJson={updateJson}
        />
      );
    case "array":
      return (
        <SchemaArray
        schema={schema}
        path={path}
        getJson={getJson}
        updateJson={updateJson}
      />
      );
    case "boolean":
      return (
        <SchemaBoolean
          schema={schema}
          path={path}
          getJson={getJson}
          updateJson={updateJson}
        />
      );
      case "number":
      case "integer":
        return (
          <SchemaNumber
            schema={schema}
            path={path}
            getJson={getJson}
            updateJson={updateJson}
          />
        );
    default:
      return <div>Path= {path}</div>;
  }
};

// Find value in JSON object based on path
export const findJSONValue = (json: Record<string, any>, path: string, initialValue?: any) => {
  // Navigate through the object using the path
  const keys = path.split(".");
  let temp: any = json;

  for (let i = 1; i < keys.length - 1; i++) {
    // Check if the key represents an array with index.
    // If so, extract the key without the index, check if the array exists and check if the array conatins the index
    // If the array does not exist, create the array.
    // If the array does not contain the index, create all of the indices up to the index and set the value to an empty object
    //console.log("Checking key ", keys[i]);

    if (keys[i].includes("[")) {
      //console.log("Key with array value found!", keys[i])
      const key = keys[i].split("[")[0];
      const index = parseInt(keys[i].split("[")[1].replace("]", ""));
      if (!(key in temp)) {
        temp[key] = [];
      }
      if (!Array.isArray(temp[key])) {
        throw new Error(`Invalid path: ${path}`);
      }
      if (index >= temp[key].length) {
        for (let j = temp[key].length; j <= index; j++) {
          temp[key].push({});
        }
      }
      temp = temp[key][index];
    } else {
      if (!(keys[i] in temp)) {
        temp[keys[i]] = {};
      }
      temp = temp[keys[i]];
    }
  }

  if (keys[keys.length - 1].includes("[")) {
    const key = keys[keys.length - 1].split("[")[0];
    const index = parseInt(keys[keys.length - 1].split("[")[1].replace("]", ""));
    console.log(temp, key, temp[key][index])
    return {
      object: temp[key],
      key: index,
      value: temp[key][index]
    }
  }

  return {
    object: temp,
    key: keys[keys.length - 1],
    value: temp[keys[keys.length - 1]],
  };
};

export const existsJSONValue = (json: Record<string, any>, path: string) => {
  // Navigate through the object using the path
  const keys = path.split(".");
  let temp: any = json;

  for (let i = 1; i < keys.length; i++) {
    //console.log("Checking key = ", keys[i], "in path " , path);

    // Check if the key represents an array with index.
    // If so, extract the key without the index, check if the array exists and check if the array contains the index
    if (keys[i].includes("[")) {
      const key = keys[i].split("[")[0];
      const index = parseInt(keys[i].split("[")[1].replace("]", ""));
      if (!(key in temp)) {
        return false;
      }
      if (!Array.isArray(temp[key])) {
        return false;
      }
      if (index >= temp[key].length) {
        return false;
      }
      temp = temp[key][index];
    } else {
      //console.log("Item = " , temp);
      if (!temp) {
        return false;
      }

      if (!(keys[i] in temp)) {
        return false;
      }
      temp = temp[keys[i]];
    }
  }

  //console.log("Found!")
  return true;
}
