import React from "react";
import { FormGroup, Popover, Menu, MenuItem, Button } from "@blueprintjs/core";
import SchemaArray from "./SchemaArray";
import SchemaObject from "./SchemaObject";
import SchemaString from "./SchemaString";

// Function to render string type
export const renderString = (data: any, updateJson: (path: string, value: any) => void, path: string) => (
  <div>
    <input
      type="text"
      value={data || ""}
      onChange={(e) => updateJson(path, e.target.value)}
    />
  </div>
);

// Function to render number type
export const renderNumber = (data: any, updateJson: (path: string, value: any) => void, path: string) => (
  <div>
    <input
      type="number"
      value={data || ""}
      onChange={(e) => updateJson(path, e.target.value)}
    />
  </div>
);

// Function to render boolean type
export const renderBoolean = (data: any, updateJson: (path: string, value: any) => void, path: string) => (
  <div>
    <input
      type="checkbox"
      checked={data || false}
      onChange={(e) => updateJson(path, e.target.checked)}
    />
  </div>
);

export const renderEnum = (
  schema: Record<string, any>,
  data: any,
  updateJson: (path: string, value: any) => void,
  path: string
) => (
  <div>
    <FormGroup label={schema["title"]} labelFor={path}>
      {/* Dropdown for enum */}
      <Popover
        content={
          <Menu>
            {schema["enum"].map((option: string) => (
              <MenuItem
                key={option}
                text={option}
                onClick={() => updateJson(path, option)}
              />
            ))}
          </Menu>
        }
        position="bottom"
      >
        <Button text={data || schema["enum"][0]} rightIcon="caret-down" />
      </Popover>
    </FormGroup>
  </div>
);

// Function to render array type
export const renderArray = (
  schema: Record<string, any>,
  fullSchema: Record<string, any>,
  data: any,
  updateJson: (path: string, value: any) => void,
  path: string
) => (
  <div>
    <SchemaArray
      schema={schema}
      fullSchema={fullSchema}
      data={data}
      updateJson={updateJson}
      path={path}
    />
  </div>
);

// Function to render object type
export const renderObject = (
  schema: Record<string, any>,
  fullSchema: Record<string, any>,
  data: any,
  updateJson: (path: string, value: any) => void
) => (
  <div>
    <SchemaObject
      schema={schema}
      fullSchema={fullSchema}
      data={data}
      updateJson={updateJson}
    />
  </div>
);


// 🔹 Helper function to resolve $ref references
export const resolveRef = (schema: Record<string, any>, fullSchema: Record<string, any>) => {
  if (!schema || typeof schema !== "object") return {}; 
  if (!fullSchema || typeof fullSchema !== "object") return schema; 

  if ("$ref" in schema) {
    const refPath = schema["$ref"] as string;
    const refParts = refPath.split("/");

    if (refParts.length >= 3 && refParts[0] === "#" && refParts[1] === "$defs") {
      const defKey = refParts[2];
      return fullSchema["$defs"]?.[defKey] || schema;
    }
  }

  return schema;
};

export const renderSchemaType = (
  schema: Record<string, any>, 
  fullSchema: Record<string, any>, 
  data: any, 
  updateJson: (path: string, value: any) => void, 
  path: string
) => {
  const resolvedSchema = resolveRef(schema, fullSchema);

  // Check if the schema has an enum and if type is string
  if (resolvedSchema["enum"]) {
    return renderEnum(resolvedSchema, data, updateJson, path); // Render enum if it's available
  }

  // Handle the type-based rendering
  switch (resolvedSchema["type"]) {
    case "object":
      return <SchemaObject schema={resolvedSchema} fullSchema={fullSchema} data={data} updateJson={updateJson} />;
    case "string":
      return <SchemaString schema={resolvedSchema} data={data} updateJson={updateJson} path={path} />;
    case "array":
      return <SchemaArray schema={resolvedSchema} fullSchema={fullSchema} data={data || []} updateJson={updateJson} path={path} />;
    case "boolean":
      return renderBoolean(data, updateJson, path);
    case "number":
      return renderNumber(data, updateJson, path);
    // Add more types here (e.g., integer, number, boolean)
    default:
      return <div>{JSON.stringify(data)}</div>;
  }
};