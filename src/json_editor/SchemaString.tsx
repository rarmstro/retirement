import React, { useState } from "react";
import { InputGroup, FormGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";
import { findJSONValue, resolveSchema } from "./SchemaUtils";

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

  const resolvedSchema = resolveSchema(schema, path);
  const element = findJSONValue(json, path);
  let initialData = element.object[element.key] || resolvedSchema["default"] || ""
  if (resolvedSchema["enum"]) {
    initialData = initialData || resolvedSchema["enum"][0];
  }

  const [data, setData] = useState(
    initialData
  );

  const selectInput = (schema) => {
    if (schema["enum"]) {
      return enumInput();
    } else {
      return stringInput();
    }
  } 

  const enumInput = () => {
    return (
      <Popover
        content={
          <Menu>
            {resolvedSchema["enum"].map((option: string) => (
              <MenuItem
                key={option}
                text={option}
                onClick={() => { updateJson(path, option);
                  setData(option); }
                }
              />
            ))}
          </Menu>
        }
        position="bottom"
      >
        <Button text={data} />
      </Popover>    )
  }

  const stringInput = () => {
    return (
      <InputGroup
      value={data || ""} // Use current data or empty string
      onChange={(e) => {
        updateJson(path, e.target.value);
        setData(e.target.value);
      }}
    />
    )
  }

  return (
    <div>
      <FormGroup label={resolvedSchema["title"]}>
        { selectInput(resolvedSchema) }
      </FormGroup>
    </div>
  );
};

export default SchemaString;
