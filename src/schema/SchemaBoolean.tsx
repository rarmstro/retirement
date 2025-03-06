import React from "react";
import { FormGroup, Checkbox } from "@blueprintjs/core";

interface SchemaBooleanProps {
  schema: Record<string, any>;
  data: any;
  updateJson: (path: string, value: any) => void;
  path: string;
}

const SchemaBoolean: React.FC<SchemaBooleanProps> = ({ schema, data, updateJson, path }) => (
  <div>
    <FormGroup label={schema["title"]} labelFor={path}>
      <Checkbox
        checked={data || false}
        onChange={(e) => updateJson(path, e.target.checked)}
      >
        {schema["title"]}
      </Checkbox>
    </FormGroup>
  </div>
);

export default SchemaBoolean;
