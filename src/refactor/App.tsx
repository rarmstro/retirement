import React, { useRef, useState } from "react";
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

import Ajv from "ajv";

const ajv = new Ajv({ useDefaults: true });

const App: React.FC = () => {
  const [schema, setSchema] = useState<any>(null);
  const [json, setJson] = useState<any>(null);
  const [filename, setFilename ] = useState<string>("settings.json");

  const schemaInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const saveFile = () => {
    const jsonData = JSON.stringify(json, null, 2); // Format JSON with 2 spaces for readability
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    console.log("Saving file as:", filename);
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSchemaLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected:", event.target.files); // Add this to debug
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const schema = JSON.parse(reader.result as string);

          // Validate the schema using AJV
          ajv.compile(schema);
          console.log("Schema is valid:");
          setSchema(schema);
          setJson(null);
        } catch (error) {
          console.error("Error parsing schema:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerSchemaLoad = () => {
    if (schemaInputRef && schemaInputRef.current) {
      schemaInputRef.current.click();
      schemaInputRef.current.value = "";
    }
  };

  const handleJsonLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected:", event.target.files); // Add this to debug
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const validate = ajv.compile(schema);

          const content = reader.result as string;
          const jsonData = JSON.parse(content);
          // Validate the JSON data using the schema
          const valid = validate(jsonData);

          if (valid) {
            console.log("JSON data is valid");
            setJson(jsonData);
            setFilename(file.name);
            console.log(file.name);
            console.log(jsonData);
          } else {
            console.error("Invalid JSON data:", validate?.errors);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerJsonLoad = () => {
    if (jsonInputRef && jsonInputRef.current) {
      jsonInputRef.current.click();
      jsonInputRef.current.value = "";
    }
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
        onClick={saveFile}
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

      <JSONEditor json={json} schema={schema} />  
    </div>
  );
};

export default App;
