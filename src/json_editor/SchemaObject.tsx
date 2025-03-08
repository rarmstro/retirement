import React, { useState } from "react";
import { Button, Collapse, Card } from "@blueprintjs/core";
import { resolveSchema, renderSchemaType } from "./SchemaUtils";

interface SchemaObjectProps {
  schema: object;
  path: string;
  getJson: () => Record<string, any>;
  updateJson: (path: string, value: any) => void;
}

const SchemaObject: React.FC<SchemaObjectProps> = ({
  getJson,
  schema,
  path,
  updateJson,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const resolvedSchema = resolveSchema(schema, path);

  return (
    <div>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bp3-intent-primary"
        style={{ marginBottom: "10px", display: "block", width: "100%" }}
      >
        {isOpen ? "Hide" : "Show"} {resolvedSchema["title"] || "Object"}
      </Button>
      <Collapse isOpen={isOpen}>
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
      </Collapse>
    </div>
  );
};

export default SchemaObject;
