import React, { useState, useEffect } from "react";
import { FormGroup, Button, Card, Divider } from "@blueprintjs/core";
import { renderSchemaType, resolveSchema } from "./SchemaUtils";
import { traverseJsonPath, getDefaultValue, resolveRef } from "./JSONUtils";

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
  //console.log("SchemaArray: Rendering component for path:", path);

  const resolvedSchema = resolveSchema(schema, path);
  //console.log("SchemaArray: resolvedSchema:", resolvedSchema);

  let itemSchema = resolvedSchema.items;
  //console.log("SchemaArray: itemSchema before $ref resolution:", itemSchema);

  // Check if there is a $ref at the current level of the schema
  if (itemSchema["$ref"]) {
    //console.log("SchemaArray: Resolving $ref:", itemSchema["$ref"]);
    itemSchema = resolveRef(schema, itemSchema["$ref"]);
    //console.log("SchemaArray: itemSchema after $ref resolution:", itemSchema);
  }

  const json = getJson();
  //console.log("SchemaArray: Full JSON:", json);

  const traverse = traverseJsonPath(json, path);
  // if (traverse.exists) {
  //   console.log(
  //     "SchemaArray: Found existing data at path:",
  //     path,
  //     "value:",
  //     traverse.value
  //   );
  // } else {
  //   console.log("SchemaArray: No existing data found at path:", path);
  // }

  let initialData = getDefaultValue(schema, resolvedSchema);
  //console.log("SchemaArray: initialData:", initialData);

  const [data, setData] = useState(
    traverse.value !== undefined ? traverse.value : initialData
  );

  const handleValueChange = (value) => {
    setData(value);
    updateJson(path, value);
  };

  //Add useEffect to sync state with external changes
  useEffect(() => {
    const traverse = traverseJsonPath(json, path);
    if (traverse.exists) {
      const newData = traverse.value;
      console.log("SchemaArray: useEffect triggered, new data:", newData);
      setData(newData);
    }
  }, [json, path]);

  const handleAdd = () => {
    //console.log("SchemaArray: handleAdd - adding new item to data = ", data);
    const newArray = data.concat(initialData);
    //console.log("SchemaArray: handleAdd - path:", path, "newArray:", newArray);
    handleValueChange(newArray);
  };

  const handleRemove = (index: number) => {
    console.log("SchemaArray: handleRemove - removing index:", index);
    const newArray = [...data];
    newArray.splice(index, 1);
    console.log("SchemaArray: handleRemove - new data after removal:", newArray);
    handleValueChange(newArray);
  };

  if (!traverse.exists) {
    return (
      <Button
        icon="add"
        onClick={() => handleValueChange([])}
        style={{ margin: "2px" }}
        className="bp3-intent-success"
      >
        Add{" "}
        {(resolvedSchema.title || path.split(".").pop())
          .replace(/([A-Z])/g, " $1")
          .replace(/^\w/, (c) => c.toUpperCase())}
      </Button>
    );
  }

  return (
    <FormGroup label={resolvedSchema.title}>
      <Card
        className="schema-array-card"
        style={{ margin: "2px", padding: "2px" }}
      >
        <Button
          icon="add"
          onClick={handleAdd}
          style={{ margin: "2px" }}
          className="bp3-intent-success"
        >
          Add{" "}
          {(itemSchema.title || "")
            .replace(/([A-Z])/g, " $1")
            .replace(/^\w/, (c) => c.toUpperCase())}
        </Button>
     {data.map((item, index) => {
        const itemPath = `${path}[${index}]`;
        console.log(
          "SchemaArray: Rendering item at path:",
          itemPath,
          "value:",
          item
        );
        return (
          <div key={`${path}-item-${index}`} style={{ margin: "1px", border: "3px solidrgb(44, 115, 207)" }}>
            <Card
              className="schema-array-item"
              style={{ padding: "1px", margin: "1px", border: "3px solidrgb(44, 115, 207)" }}
            >
              {renderSchemaType(
                schema,
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
    </FormGroup>
  );




  // const handleAdd = () => {
  //   const newValue = initialData || { };
  //   const newData = [...data, newValue];
  //   console.log("SchemaArray: handleAdd - path:", path, "newData:", newData);
  //   setData(newData);
  //   updateJson(path, newData);
  // };

  // const handleRemove = (index: number) => {
  //   console.log("SchemaArray: handleRemove - removing index:", index);
  //   const newData = [...data];
  //   newData.splice(index, 1);
  //   console.log("SchemaArray: handleRemove - new data after removal:", newData);
  //   setData(newData);
  //   updateJson(path, newData);
  // };

  // console.log("SchemaArray: Rendering UI with data:", data);

  // return (
  //   <Card
  //     className="schema-array-card"
  //     style={{ padding: "15px", marginBottom: "20px" }}
  //   >
  //     <Button
  //       icon="add"
  //       onClick={handleAdd}
  //       style={{ marginBottom: "15px" }}
  //       className="bp3-intent-success"
  //     >
  //       {resolvedSchema.title || "Item"}
  //     </Button>
  //     {data.map((item, index) => {
  //       const itemPath = `${path}[${index}]`;
  //       console.log(
  //         "SchemaArray: Rendering item at path:",
  //         itemPath,
  //         "value:",
  //         item
  //       );
  //       return (
  //         <div key={`${path}-item-${index}`} style={{ marginBottom: "10px" }}>
  //           <Card
  //             className="schema-array-item"
  //             style={{ padding: "10px", marginBottom: "5px" }}
  //           >
  //             {renderSchemaType(
  //               schema,
  //               itemPath,
  //               getJson,
  //               updateJson,
  //               false,
  //               false
  //             )}
  //             <Button
  //               icon="trash"
  //               onClick={() => handleRemove(index)}
  //               style={{ marginLeft: "10px" }}
  //               className="bp3-intent-danger"
  //             />
  //           </Card>
  //           {index < data.length - 1 && <Divider />}
  //         </div>
  //       );
  //     })}
  //   </Card>
  // );

  return <div>TBD</div>;
};

export default SchemaArray;
