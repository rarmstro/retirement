import React from "react";
import SchemaArray from "./SchemaArray";
import SchemaObject from "./SchemaObject";
import SchemaString from "./SchemaString";
import SchemaEnum from "./SchemaEnum";
import SchemaNumber from "./SchemaNumber";
import SchemaBoolean from "./SchemaBoolean";

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

// 🔹 Helper function to render schema based on type
export const renderSchemaType = (
  schema: Record<string, any>, 
  fullSchema: Record<string, any>, 
  data: any, 
  updateJson: (path: string, value: any) => void, 
  path: string
) => {
  const resolvedSchema = resolveRef(schema, fullSchema);

  // If the schema contains an 'enum' and has a 'type', treat it as a special case (for enum handling)
  if (resolvedSchema["enum"] && resolvedSchema["type"]) {
    // Special handling for enum with specific type (e.g., type: "string" + enum)
    return <SchemaEnum schema={resolvedSchema} data={data} updateJson={updateJson} path={path} />;
  }

  switch (resolvedSchema["type"]) {
    case "object":
      return <SchemaObject schema={resolvedSchema} fullSchema={fullSchema} data={data} updateJson={updateJson} />;
    case "string":
      return <SchemaString schema={resolvedSchema} data={data} updateJson={updateJson} path={path} />;
    case "array":
      return <SchemaArray schema={resolvedSchema} fullSchema={fullSchema} data={data || []} updateJson={updateJson} path={path} />;
    case "number":
      return <SchemaNumber schema={resolvedSchema} data={data} updateJson={updateJson} path={path} />;
    case "boolean":
      return <SchemaBoolean schema={resolvedSchema} data={data} updateJson={updateJson} path={path} />;
    default:
      return <div>{JSON.stringify(data)}</div>;
  }
};
