import React, { useState } from "react";
import { Button, Collapse, Card } from "@blueprintjs/core";
import { renderSchemaType, resolveRef } from "./SchemaUtils"; // Import from SchemaUtils

interface SchemaObjectProps {
  schema: Record<string, any>;
  fullSchema: Record<string, any>;
  data: Record<string, any>;
  updateJson: (path: string, value: any) => void;
}

const SchemaObject: React.FC<SchemaObjectProps> = ({ schema, fullSchema, data, updateJson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const resolvedSchema = resolveRef(schema, fullSchema);

  return (
    <Card className="schema-object-card" style={{ marginBottom: "20px", padding: "15px" }}>
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bp3-intent-primary" 
        style={{ marginBottom: "10px", display: "block", width: "100%" }}
      >
        {isOpen ? "Hide" : "Show"} {resolvedSchema["title"]}
      </Button>
      <Collapse isOpen={isOpen}>
        <div style={{ padding: "10px 20px" }}>
          {Object.keys(resolvedSchema["properties"] || {}).map((key) => (
            <div id={key} key={key} style={{ marginBottom: "15px" }}>
              {renderSchemaType(resolvedSchema["properties"][key], fullSchema, data?.[key], updateJson, `${key}`)}
            </div>
          ))}
        </div>
      </Collapse>
    </Card>
  );
};

export default SchemaObject;
