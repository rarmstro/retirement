import React from "react";
import { FormGroup, InputGroup } from "@blueprintjs/core";

interface SchemaNumberProps {
  schema: Record<string, any>;
  data: any;
  updateJson: (path: string, value: any) => void;
  path: string;
}

const SchemaNumber: React.FC<SchemaNumberProps> = ({ schema, data, updateJson, path }) => (
  <div>
    <FormGroup label={schema["title"]} labelFor={path}>
      <InputGroup
        type="number"
        value={data || ""}
        onChange={(e) => updateJson(path, e.target.value)}
      />
    </FormGroup>
  </div>
);

export default SchemaNumber;
