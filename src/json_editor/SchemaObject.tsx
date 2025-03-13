import React, { useState } from "react";
import { Button, Collapse, Card } from "@blueprintjs/core";
import { resolveSchema, renderSchemaType } from "./SchemaUtils";
import { existsJSONValue } from "./SchemaUtils";

interface SchemaObjectProps {
  schema: object;
  path: string;
  getJson: () => Record<string, any>;
  updateJson: (path: string, value: any) => void;
  useCollapse?: boolean;
  open?: boolean;
}

const SchemaObject: React.FC<SchemaObjectProps> = ({
  getJson,
  schema,
  path,
  updateJson,
  useCollapse = true,
  open,
}) => {
  const handleAdd = () => {
    updateJson(path, {});
    setIsOpen(true);
  };

  const [isOpen, setIsOpen] = useState(open ?? false);

  const json = getJson();

  const resolvedSchema = resolveSchema(schema, path);

  // Return component that is simply the title and a plus button if the JSON at this level is empty
  if (!existsJSONValue(json, path)) {
    return (
      <Button
        icon="add"
        onClick={handleAdd}
        style={{ margin: "2px" }}
        className="bp3-intent-success"
      >
        {resolvedSchema["title"] || "Add"}
      </Button>
    );
  }

  const cardContent = (
    <Card
      className="schema-object-card"
      style={{ marginBottom: "20px", padding: "15px" }}
    >
      {Object.keys(resolvedSchema["properties"] || {}).map((key) => (
        <div id={key} key={key} style={{ marginBottom: "15px" }}>
          {renderSchemaType(schema, `${path}.${key}`, getJson, updateJson)}
        </div>
      ))}
    </Card>
  );

  return (
    <div>
      {useCollapse && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bp3-intent-primary"
          style={{ marginBottom: "10px", display: "block", width: "100%" }}
        >
          {isOpen ? "Hide" : "Show"} {resolvedSchema["title"] || "Object"}
        </Button>
      )}
      {useCollapse ? (
        <Collapse isOpen={isOpen} keepChildrenMounted={true}>
          {cardContent}
        </Collapse>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default SchemaObject;
