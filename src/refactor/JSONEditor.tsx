import React from "react";
import { Card, Elevation } from "@blueprintjs/core";
import { useData } from "./DataContext";

export const JSONEditor: React.FC = () => {
  const { json } = useData();

  return (
    <div className="content-container">
      <Card elevation={Elevation.TWO} className="card-container scrollable">
        {/* Left card for editing JSON values (empty for now) */}
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
