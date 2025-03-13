import React, { useState, useEffect } from "react";
import { Card, Button, Divider } from "@blueprintjs/core";
import { findJSONValue, resolveSchema } from "./SchemaUtils";
import { renderSchemaType, resolveRef } from "./SchemaUtils";

interface SchemaArrayProps {
  schema: object;
  path: string;
  getJson: () => Record<string, any>;
  updateJson: (path: string, value: any) => void;
}

const SchemaArray: React.FC<SchemaArrayProps> = ({
  schema,
  path,
  getJson,
  updateJson,
}) => {
  const resolvedSchema = resolveSchema(schema, path);
  let itemSchema = resolvedSchema.items;
  // Check if there is a $ref at the current level of the schema
  if (itemSchema["$ref"]) {
    //console.log("Resolving $ref");
    itemSchema = resolveRef(itemSchema["$ref"], schema);
  }
  //console.log("itemsSchema = ", itemSchema);

  const json = getJson();
  //console.log("SchemaArray : path = ", path);
  const element = findJSONValue(json, path, []);
  //console.log(element);

  const initialData = element?.object?.[element.key] || [];

  const [data, setData] = useState(initialData);

  // Add useEffect to sync state with external changes
  useEffect(() => {
    const currentElement = findJSONValue(getJson(), path, []);
    setData(currentElement?.object?.[currentElement.key] || []);
  }, [getJson, path]);

  const handleAdd = () => {
    const newValue = itemSchema?.default ?? {};
    const newData = [...data, newValue];
    //console.log("path = ", path, "newData = ", newData);
    setData(newData);
    updateJson(path, newData);
  };

  const handleRemove = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    updateJson(path, newData);
  };

  return (
    <Card
      className="schema-array-card"
      style={{ padding: "15px", marginBottom: "20px" }}
    >
      <Button
        icon="add"
        onClick={handleAdd}
        style={{ marginBottom: "15px" }}
        className="bp3-intent-success"
      >
        {resolvedSchema.title || "Item"}
      </Button>
      {data.map((item, index) => {
        const itemPath = `${path}[${index}]`;
        //console.log(itemPath);
        return (
          <div
            key={`${path}-item-${index}-${data.length}`}
            style={{ marginBottom: "10px" }}
          >
            <Card
              className="schema-array-item"
              style={{ padding: "10px", marginBottom: "5px" }}
            >
              {renderSchemaType(
                itemSchema,
                itemPath,
                getJson,
                updateJson,
                false,
                false
              )}
              <Button
                icon="trash"
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
