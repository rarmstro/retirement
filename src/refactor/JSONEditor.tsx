import React, { useEffect, useState } from "react";
import { Card, Elevation } from "@blueprintjs/core";
import { useData } from "./DataContext";
import { renderSchemaType } from "../json_editor/SchemaUtils";
import { findJSONValue } from "../json_editor/SchemaUtils";

export const JSONEditor: React.FC = () => {
  const { schema, json, setJson, uniqueKey } = useData();
  const [renderKey, setRenderKey] = useState<string>(uniqueKey);

  // Add useEffect to monitor schema or json changes
  useEffect(() => {
    setRenderKey(uniqueKey);
  }, [schema, json]);

  const updateJson = (path: string, value: any) => {
    //console.log("Path = ", path, "Value = ", value);
    setJson((prevData) => {
      // Create a deep copy of prevData
      const newData = JSON.parse(JSON.stringify(prevData));

      let result = findJSONValue(newData, path, {});
      result.object[result.key] = value;

      //console.log("Updated JSON:", newData); // Debugging output
      return newData;
    });
  };

  const getJson = () => {
    return json;
  };

  return (
    <div className="content-container">
      <Card
        elevation={Elevation.TWO}
        className="card-container scrollable"
        key={`schema-card-${renderKey}`}
      >
        {schema
          ? renderSchemaType(schema, "$", getJson, updateJson, true, true)
          : "No schema loaded"}
      </Card>
      <Card elevation={Elevation.TWO} className="card-container scrollable">
        <pre>
          {json ? JSON.stringify(json, null, 2) : "No JSON data loaded"}
        </pre>
      </Card>
    </div>
  );
};

export default JSONEditor;
