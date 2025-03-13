import React, { useState } from "react";
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { traverseJsonPath, getDefaultValue, resolveSchema } from "./JSONUtils";

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
  const resolve = resolveSchema(schema, path);

  if (!resolve.exists) {
    return <div>Invalid path Path= {path}</div>;
  }

  const resolvedSchema = resolve.value;
  const traverse = traverseJsonPath(json, path);

  let initialData = getDefaultValue(resolvedSchema) || 0;
  if (resolvedSchema.enum) {
    initialData = initialData || resolvedSchema.enum[0];
  }

  const [data, setData] = useState<number>(
    traverse.value !== undefined ? Number(traverse.value) : initialData
  );

  const handleValueChange = (value: number) => {
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

  return (
    <div>
      <FormGroup label={resolvedSchema.title} labelFor={path}>
        <InputGroup
          type="number"
          value={data.toString()}
          onChange={(e) => handleValueChange(Number(e.target.value))}
          title={path}
        />
      </FormGroup>
    </div>
  );
};

export default SchemaNumber;
