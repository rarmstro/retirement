import React, { useRef, useState } from "react";
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
} from "@blueprintjs/core";
import StackedBarChart from "./Chart"; // Import the Chart component
import { DataProvider, useData } from "./DataContext"; // Import the DataContext
import JSONEditor from "./json_editor/JSONEditor";

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
};

const MainApp: React.FC = () => {
  const { data, setData, loadSchema, loadFile, saveFile, schema} = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const schemaInputRef = useRef<HTMLInputElement>(null);

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const handleSchemaLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadSchema(file);
    }
  };

  const handleLoadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSchemaButtonClick = () => {
    schemaInputRef.current?.click();
  };

  return (
    <div>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Retirement Planner</NavbarHeading>
          <NavbarDivider />
          <Button
            icon="cog"
            text="Load Schema"
            onClick={handleSchemaButtonClick}
          />
          <input
            type="file"
            ref={schemaInputRef}
            style={{ display: "none" }}
            onChange={handleSchemaLoad}
          />
          {schema && (
            <>
              <Button
                icon="folder-open"
                text="Load"
                onClick={handleLoadButtonClick}
              />
              <Button icon="floppy-disk" text="Save" onClick={saveFile} />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileLoad}
              />
            </>
          )}
        </NavbarGroup>
      </Navbar>

      { schema && (

       <div style={{ width: "100%", margin: "10px 10px" }}>
        <JSONEditor json={data} schema={schema} />
      </div> )}

      <div style={{ width: "100%", margin: "10px 10px" }}>
        {/* <div id="chart-holder" style={{ margin: "10px auto" }}>
          <StackedBarChart />
        </div> */}
      </div>
    </div>
  );
};

export default App;
