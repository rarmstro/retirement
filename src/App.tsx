import React, { useRef, useState } from "react";
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button } from "@blueprintjs/core";
import StackedBarChart from "./Chart"; // Import the Chart component
import { DataProvider, useData } from "./DataContext"; // Import the DataContext
import schema from '../test/testSchema.json';
import JSONEditor from "./json_editor/JSONEditor";

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
};

const MainApp: React.FC = () => {
  const { data, setData, loadFile, saveFile } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const handleLoadButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Retirement Planner</NavbarHeading>
          <NavbarDivider />
          <Button icon="folder-open" text="Load" onClick={handleLoadButtonClick} />
          <Button icon="floppy-disk" text="Save" onClick={saveFile} />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileLoad}
          />
        </NavbarGroup>
      </Navbar>

      <div style={{ width: '100%', margin: '10px 10px' }}>
        <JSONEditor json={data} schema={schema} />
      </div>
      <div style={{ width: '100%', margin: '10px 10px' }}>
        <div id="chart-holder" style={{  margin: '10px auto' }}>
        <StackedBarChart />
        </div>
      </div>
    </div>
  );
};

export default App;