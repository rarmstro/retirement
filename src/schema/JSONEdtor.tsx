import React, { useState } from "react";
import SchemaObject from "./SchemaObject";

interface JSONEditorProps {
  json: object;
  schema: object;
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  return (
    <SchemaObject schema={props.schema} />
  );  
};

export default JSONEditor;
