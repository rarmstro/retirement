import React from "react";
import { FormGroup, InputGroup } from "@blueprintjs/core";

interface SchemaStringProps {
  schema: object;
  data: any; // Receives current JSON data
  updateJson: (path: string, value: any) => void; // Function to update JSON
  path: string; // Path to this field in the JSON structure
}

const SchemaString: React.FC<SchemaStringProps> = ({ schema, data, updateJson, path }) => {
  return (
    <div>
      <FormGroup label={schema["title"]}>
        <InputGroup
          value={data || ""} // Use current data or empty string
          onChange={(e) => updateJson(path, e.target.value)} // Update JSON on change
        />
      </FormGroup>
    </div>
  );
};

export default SchemaString;
