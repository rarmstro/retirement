import React, { useState } from "react";
import { findJSONValue, renderSchemaType } from "./SchemaUtils";
import { useData } from "../DataContext"; // Import the DataContext
import { TextArea } from "@blueprintjs/core"; // Import BlueprintJS TextArea

interface JSONEditorProps {
  json: object;
  schema: object;
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  const { data, setData, schema } = useData();

  const updateJson = (path: string, value: any) => {
    //console.log("Path = ", path, "Value = ", value);
    setData((prevData) => {
      // Create a deep copy of prevData
      const newData = JSON.parse(JSON.stringify(prevData));

      let result = findJSONValue(newData, path, {});
      result.object[result.key] = value;

      //console.log("Updated JSON:", newData); // Debugging output
      return newData;
    });
  };

  const getJson = () => {
    return data;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <h4>Schema:</h4>
          <TextArea
            readOnly
            value={JSON.stringify(schema, null, 2)}
            style={{ width: "100%", height: "200px" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4>Data:</h4>
          <TextArea
            readOnly
            value={JSON.stringify(data, null, 2)}
            style={{ width: "100%", height: "200px" }}
          />
        </div>
      </div>
      {renderSchemaType(props.schema, "$", getJson, updateJson)}
    </div>
  );
};

export default JSONEditor;
