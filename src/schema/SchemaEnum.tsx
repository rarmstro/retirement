import React from "react";
import { FormGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";

interface SchemaEnumProps {
  schema: Record<string, any>;
  data: any;
  updateJson: (path: string, value: any) => void;
  path: string;
}

const SchemaEnum: React.FC<SchemaEnumProps> = ({ schema, data, updateJson, path }) => (
  <div>
    <FormGroup label={schema["title"]} labelFor={path}>
      <Popover
        content={
          <Menu>
            {schema["enum"].map((option: string) => (
              <MenuItem
                key={option}
                text={option}
                onClick={() => updateJson(path, option)}
              />
            ))}
          </Menu>
        }
        position="bottom"
      >
        <Button text={data || schema["enum"][0]} rightIcon="caret-down" />
      </Popover>
    </FormGroup>
  </div>
);

export default SchemaEnum;
