import React from "react";
import { FormGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";

interface SchemaEnumProps {
  schema: any;
  path: string;
  value: string;
  onValueChange: (value: string) => void;
}

const SchemaEnum: React.FC<SchemaEnumProps> = ({
  schema,
  path,
  value,
  onValueChange,
}) => {
  return (
    <FormGroup label={schema.title}>
      <Popover
        content={
          <Menu>
            {schema.enum.map((option: string) => (
              <MenuItem
                key={option}
                text={option}
                onClick={() => onValueChange(option)}
              />
            ))}
          </Menu>
        }
        position="bottom"
      >
        <Button text={value || "Select..."} title={path} />
      </Popover>
    </FormGroup>
  );
};

export default SchemaEnum;