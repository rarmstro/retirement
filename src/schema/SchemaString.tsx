import React from "react";
import { FormGroup, InputGroup } from "@blueprintjs/core";

interface SchemaStringProps {
  schema: object;
}

const handleInputChange = (field: string, value: string) => {
  console.log( parseInt(value, 10) );
};

const SchemaString: React.FC<SchemaStringProps> = (props) => {
  return (
    <div>
      <FormGroup label={props.schema["title"]} >
        <InputGroup
          value={"foobar"}
          onChange={(e) => handleInputChange("foobar", e.target.value)}
        />
      </FormGroup>
    </div>
  );
};

export default SchemaString;

