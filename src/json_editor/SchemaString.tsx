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
  //console.log(path, traverse.value);

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
        onClick={() => handleValueChange(initialData)}
        style={{ margin: "2px" }}
        className="bp3-intent-success"
      >
        Add {(resolvedSchema.title || path.split('.').pop() || "Add")
          .replace(/([A-Z])/g, ' $1')
          .replace(/^\w/, c => c.toUpperCase())}
      </Button>
    );
  }

  if (resolvedSchema.enum) {
    return (
      <SchemaEnum
        schema={resolvedSchema}
        path={path}
        getJson={getJson}
        updateJson={updateJson}
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
