import React, { useState } from "react";
import SchemaObject from "./SchemaObject";

interface JSONEditorProps {
  json: object;
  schema: object;
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  const [data, setData] = useState(props.json);

  // 🔹 New updateJson function to handle immutable JSON updates
  const updateJson = (path: string, value: any) => {
    setData((prevData) => {
      // Create a deep copy of prevData
      const newData = JSON.parse(JSON.stringify(prevData));

      // Navigate through the object using the path
      const keys = path.split(".");
      let temp: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in temp)) {
          temp[keys[i]] = {}; // Ensure the path exists
        }
        temp = temp[keys[i]];
      }

      // Update the value at the final key
      temp[keys[keys.length - 1]] = value;

      console.log("Updated JSON:", newData); // Debugging output
      return newData;
    });
  };

  return (
    <SchemaObject 
      schema={props.schema} 
      fullSchema={props.schema} // Assuming fullSchema is the same as schema
      data={data} 
      updateJson={updateJson} 
    />
  );  
};

export default JSONEditor;
