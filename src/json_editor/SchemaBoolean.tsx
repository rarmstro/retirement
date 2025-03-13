import React, { useState } from "react";
import { FormGroup, Checkbox, Button } from "@blueprintjs/core";
import { traverseJsonPath, getDefaultValue, resolveSchema } from "./JSONUtils";

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
  const resolve = resolveSchema(schema, path);

  if (!resolve.exists) {
    return <div>Invalid path Path= {path}</div>;
  }

  const resolvedSchema = resolve.value;
  const traverse = traverseJsonPath(json, path);

  let initialData = getDefaultValue(resolvedSchema) || false;

  const [isChecked, setChecked] = useState<boolean>(
    traverse.exists ? traverse.value : initialData
  );

  const handleValueChange = (checked: boolean) => {
    setChecked(checked);
    updateJson(path, checked);
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
      <FormGroup labelFor={path}>
        <Checkbox
          checked={isChecked}
          onChange={(e) => handleValueChange(e.target.checked)}
        >
          {resolvedSchema.title}
        </Checkbox>
      </FormGroup>
    </div>
  );
};

export default SchemaBoolean;
