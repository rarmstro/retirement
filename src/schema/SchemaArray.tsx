import React from "react";
import { Button, Card, Divider } from "@blueprintjs/core";
import { renderSchemaType, resolveRef } from "./SchemaUtils"; // Import from SchemaUtils

interface SchemaArrayProps {
  schema: object;
  fullSchema: object;
  data: any[];
  updateJson: (path: string, value: any) => void;
  path: string;
}

const SchemaArray: React.FC<SchemaArrayProps> = ({ schema, fullSchema, data, updateJson, path }) => {
  const resolvedSchema = resolveRef(schema, fullSchema);
  const itemSchema = resolvedSchema["items"];

  const handleAdd = () => {
    const newValue = resolvedSchema["default"] || "";
    updateJson(path, [...data, newValue]);
  };

  const handleRemove = (index: number) => {
    const newArray = [...data];
    newArray.splice(index, 1);
    updateJson(path, newArray);
  };

  return (
    <Card className="schema-array-card" style={{ padding: "15px", marginBottom: "20px" }}>
      <h4>{resolvedSchema["title"] || "Array"}</h4>
      <Button
        icon="add"
        onClick={handleAdd}
        style={{ marginBottom: "15px" }}
        className="bp3-intent-success"
      >
        Add Item
      </Button>
      {data.map((item, index) => {
        const itemPath = `${path}[${index}]`;
        return (
          <div key={index} style={{ marginBottom: "10px" }}>
            <Card className="schema-array-item" style={{ padding: "10px", marginBottom: "5px" }}>
              {renderSchemaType(itemSchema, fullSchema, item, updateJson, itemPath)}
              <Button
                icon="trash"
                variant="minimal"  // Updated to use variant="minimal"
                onClick={() => handleRemove(index)}
                style={{ marginLeft: "10px" }}
                className="bp3-intent-danger"
              />
            </Card>
            {index < data.length - 1 && <Divider />}
          </div>
        );
      })}
    </Card>
  );
};

export default SchemaArray;
