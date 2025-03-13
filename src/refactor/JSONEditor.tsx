import React from "react";
import { Card, Elevation } from "@blueprintjs/core";



interface JSONEditorProps {
  json: object;
  schema: object;
}

export const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  return (
    <div className="content-container">
      <Card elevation={Elevation.TWO} className="card-container scrollable">
        {/* Left card for editing JSON values (empty for now) */}
      </Card>
      <Card elevation={Elevation.TWO} className="card-container scrollable">
        <pre>
          {props.json
            ? JSON.stringify(props.json, null, 2)
            : "No JSON data loaded"}
        </pre>
      </Card>
    </div>
  );
};

export default JSONEditor; 
