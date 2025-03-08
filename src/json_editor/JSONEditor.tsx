import React, { useState } from "react";
import { findJSONValue, renderSchemaType } from "./SchemaUtils";

interface JSONEditorProps {
  json: object; 
  schema: object;
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  const [data, setData] = useState(props.json);

  const updateJson = (path: string, value: any) => {
    console.log("Path = ", path, "Value = ", value);
    setData((prevData) => {
      // Create a deep copy of prevData
      const newData = JSON.parse(JSON.stringify(prevData));
      
      let result = findJSONValue(newData, path);
      result.object[result.key] = value;

      console.log("Updated JSON:", newData); // Debugging output
      return newData;
    });
  };

  return ( renderSchemaType(props.schema, props.json, "$", updateJson) );
};

export default JSONEditor;