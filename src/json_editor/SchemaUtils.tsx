import React from "react";
import SchemaObject from "./SchemaObject";
import SchemaBoolean from "./SchemaBoolean";

const resolveRef = (ref: string, schema: Record<string, any>) => {
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
      //console.log("Handling array type");
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
    case "boolean":
      return (
        <SchemaBoolean
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
export const findJSONValue = (json: Record<string, any>, path: string) => {
  // Navigate through the object using the path
  const keys = path.split(".");
  let temp: any = json;

  for (let i = 1; i < keys.length - 1; i++) {
    if (!(keys[i] in temp)) {
      temp[keys[i]] = {}; // Ensure the path exists
    }
    temp = temp[keys[i]];
  }

  return {
    object: temp,
    key: keys[keys.length - 1],
    value: temp[keys[keys.length - 1]],
  };
};
