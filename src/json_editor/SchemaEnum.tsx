import React, { useState } from "react";
import { FormGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";
import { traverseJsonPath, getDefaultValue, resolveSchema } from "./JSONUtils";

interface SchemaEnumProps {
  schema: object;
  path: string;
  getJson: () => Record<string, any>;
  updateJson: (path: string, value: any) => void;
}

const SchemaEnum: React.FC<SchemaEnumProps> = ({
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

  let initialData = getDefaultValue(schema, resolvedSchema);

  const [data, setData] = useState<string>(traverse.value || initialData);

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

  return (
    <FormGroup label={resolvedSchema.title}>
      <Popover
        content={
          <Menu>
            {resolvedSchema.enum.map((option: string) => (
              <MenuItem
                key={option}
                text={option}
                onClick={() => handleValueChange(option)}
              />
            ))}
          </Menu>
        }
        position="bottom"
      >
        <Button text={data || "Select..."} title={path} />
      </Popover>
    </FormGroup>
  );
};

export default SchemaEnum;
