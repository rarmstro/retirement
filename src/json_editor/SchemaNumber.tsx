import React, { useState } from "react";
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { existsJSONValue, findJSONValue, resolveSchema } from "./SchemaUtils";

interface SchemaNumberProps {
  schema: object;
  path: string;
  getJson: () => Record<string, any>;
  updateJson: (path: string, value: any) => void;
}

const SchemaNumber: React.FC<SchemaNumberProps> = ({
  schema,
  path,
  getJson,
  updateJson,
}) => {
  const json = getJson();

  const resolvedSchema = resolveSchema(schema, path);
  const element = findJSONValue(json, path, false);

  const handleAdd = () => {
    let initialData = resolvedSchema["default"] || "0";
    if (resolvedSchema["enum"]) {
      initialData = initialData || resolvedSchema["enum"][0];
    }

    updateJson(path, initialData);
  };

  // Return component that is simply the title and a plus button if the JSON at this level is empty
  if (!existsJSONValue(json, path)) {
    return (
        <Button
          icon="add"
          onClick={handleAdd}
          style={{ margin: "2px" }}
          className="bp3-intent-success"
        >{resolvedSchema["title"] || "Add" }</Button>
    );
  }

  const [data, setData] = useState(
    "0"
  );


  return (
    <div>
    <FormGroup label={schema["title"]} labelFor={path}>
      <InputGroup
        type="number"
        value={data.toString()}
        onChange={(e) => {
          updateJson(path, e.target.value);
          setData(e.target.value);
        }}
      />
    </FormGroup>
    </div>
  );
};

export default SchemaNumber;
