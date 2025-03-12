import React, { useState } from "react";
import { InputGroup, FormGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";
import { traverseJsonPath, getDefaultValue, resolveSchema } from "./JSONUtils";
import SchemaEnum from "./SchemaEnum";

interface SchemaStringProps {
  schema: object;
  path: string;
  getJson: () => Record<string, any>;
  updateJson: (path: string, value: any) => void;
}

const SchemaString: React.FC<SchemaStringProps> = ({
  schema,
  path,
  getJson,
  updateJson,
}) => {
  const json = getJson();
  const resolve = resolveSchema(schema, path);
  
  if (!resolve.exists) {
    return <div>Invalid path Path= {path}</div>;
  }

  const resolvedSchema = resolve.value;
  const traverse = traverseJsonPath(json, path);
  console.log(path, traverse.value);

  let initialData = getDefaultValue(resolvedSchema);

  const [data, setData] = useState<string>(initialData);

  const handleValueChange = (value: string) => {
    setData(value);
    updateJson(path, value);
  };

  if (!traverse.exists) {
    return (
      <Button
        icon="add"
        onClick={() => updateJson(path, initialData)}
        style={{ margin: "2px" }}
        className="bp3-intent-success"
      >
        {resolvedSchema.title || "Add"}
      </Button>
    );
  }

  if (resolvedSchema.enum) {
    return (
      <SchemaEnum
        schema={resolvedSchema}
        path={path}
        value={data}
        onValueChange={handleValueChange}
      />
    );
  }

  return (
    <FormGroup label={resolvedSchema.title}>
      <InputGroup
        value={data || ""}
        onChange={(e) => handleValueChange(e.target.value)}
        title={path}
      />
    </FormGroup>
  );
};

export default SchemaString;
