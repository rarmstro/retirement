import React, { useState } from "react";
import { FormGroup, Checkbox } from "@blueprintjs/core";
import { findJSONValue, resolveSchema } from "./SchemaUtils";

interface SchemaBooleanProps {
  schema: object;
  path: string;
  getJson: () => Record<string, any>;
  updateJson: (path: string, value: any) => void;
}

const SchemaBoolean: React.FC<SchemaBooleanProps> = ({
  schema,
  path,
  getJson,
  updateJson,
}) => {
  const json = getJson();

  const resolvedSchema = resolveSchema(schema, path);
  const element = findJSONValue(json, path);
  const [isChecked, setChecked] = useState(
    element.object[element.key] || false
  );

  return (
    <div>
      <FormGroup label={resolvedSchema["title"]} labelFor={path}>
        <Checkbox
          checked={isChecked}
          onChange={(e) => {
            updateJson(path, e.target.checked);
            setChecked(e.target.checked);
          }}
        >
          {resolvedSchema["title"]}
        </Checkbox>
      </FormGroup>
    </div>
  );
};

export default SchemaBoolean;
