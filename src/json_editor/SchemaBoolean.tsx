import React from "react";
import { FormGroup, Checkbox } from "@blueprintjs/core";
import { resolveSchema } from "./SchemaUtils"; 

interface SchemaBooleanProps {
  json: object; 
  schema: object;
  path: string;
  updateJson: (path: string, value: any) => void;
}

const SchemaBoolean: React.FC<SchemaBooleanProps> = ({ json, schema, path, updateJson }) => {

  const resolvedSchema = resolveSchema(schema, path);

  // Navigate through the object using the path
  const keys = path.split(".");
  let temp: any = json;

  for (let i = 1; i < keys.length - 1; i++) {
    if (!(keys[i] in temp)) {
      temp[keys[i]] = {}; // Ensure the path exists
    }
    temp = temp[keys[i]];
  }

  return (
    <div>
    <FormGroup label={resolvedSchema["title"]} labelFor={path}>
      <Checkbox
        checked={temp[keys[keys.length - 1]]}
        onChange={(e) => updateJson(path, e.target.checked)}
      >
        {resolvedSchema["title"]}
      </Checkbox>
    </FormGroup>
  </div>
  );
};


export default SchemaBoolean;
