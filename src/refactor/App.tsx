import React, { useRef } from "react";
import {
  Navbar,
  Alignment,
  Button,
  Menu,
  MenuItem,
  Popover,
  Position,
} from "@blueprintjs/core";
import JSONEditor from "./JSONEditor";
import { DataProvider, useData } from "./DataContext"; // Import the DataContext

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
};

const MainApp: React.FC = () => {
  const { schema, json, loadSchema, loadJson, saveJson } = useData();
  const schemaInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const triggerSchemaLoad = () => {
    if (schemaInputRef.current) {
      schemaInputRef.current.click();
      schemaInputRef.current.value = "";
    }
  };

  const triggerJsonLoad = () => {
    if (jsonInputRef.current) {
      jsonInputRef.current.click();
      jsonInputRef.current.value = "";
    }
  };

  const handleSchemaLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadSchema(file);
  };

  const handleJsonLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadJson(file);
  };

  const menu = (
    <Menu>
      <MenuItem icon="cog" text="Load Schema" onClick={triggerSchemaLoad} />
      <MenuItem
        icon="folder-open"
        text="Load Settings"
        disabled={!schema}
        onClick={triggerJsonLoad}
      />
      <MenuItem
        icon="floppy-disk"
        text="Save Settings"
        disabled={!schema || !json}
        onClick={saveJson}
      />
    </Menu>
  );

  return (
    <div className="app-container">
      <input
        type="file"
        ref={schemaInputRef}
        style={{ display: "none" }}
        onChange={handleSchemaLoad}
      />
      <input
        type="file"
        ref={jsonInputRef}
        style={{ display: "none" }}
        onChange={handleJsonLoad}
      />

      <Navbar>
        <Navbar.Group align={Alignment.START}>
          <Navbar.Heading>Retirement Planner</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.END}>
          <Popover content={menu} position={Position.BOTTOM}>
            <Button icon="menu" />
          </Popover>
        </Navbar.Group>
      </Navbar>

      <JSONEditor />
    </div>
  );
};

export default App;
