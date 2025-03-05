import React, { useState } from "react";
import { Button, Collapse } from "@blueprintjs/core";
import SchemaObject from "./SchemaObject";

interface JSONEditorProps {
  title: string;
  json: object;
  schema: object;
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  return (
    <SchemaObject title={props.title} json={props.json} schema={props.schema} />
  );  
};

export default JSONEditor;
