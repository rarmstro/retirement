import React, { useState } from "react";
import { renderSchemaType } from "./SchemaUtils";

interface JSONEditorProps {
  json: object; 
  schema: object;
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  const [data, setData] = useState(props.json);

  const updateJson = (path: string, value: any) => {
    setData((prevData) => {
      // Create a deep copy of prevData
      const newData = JSON.parse(JSON.stringify(prevData));

      console.log("Updated JSON:", newData); // Debugging output

      return newData;
    });
  };

  return ( renderSchemaType(props.schema, props.json, "$", updateJson) );
};

export default JSONEditor;