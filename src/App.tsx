import React, { useRef, useState } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Collapse, FormGroup, InputGroup } from "@blueprintjs/core";
import StackedBarChart from "./Chart"; // Import the Chart component
import { DataProvider, useData } from "./DataContext"; // Import the DataContext
import schema from './schema.json';
import JSONEditor from "./schema/JSONEdtor";

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

  const handleInputChange = (field: string, value: string) => {
    setData({ ...data, [field]: parseInt(value, 10) });
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
        <JSONEditor title="Settings" json={data} schema={schema} />
      </div>
      <div style={{ width: '100%', margin: '10px 10px' }}>
        <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Hide" : "Show"} Data</Button>
        <Collapse isOpen={isOpen}> 
          <div style={{ width: '100%', margin: '10px 10px' }}>
            <FormGroup label={schema.properties.startYear.title} labelFor="start-year-input">
              <InputGroup
                id="start-year-input"
                value={data.startYear?.toString() || ""}
                onChange={(e) => handleInputChange("startYear", e.target.value)}
              />
            </FormGroup>
            <FormGroup label={schema.properties.lifeExpectancy.title} labelFor="life-expectancy-input">
              <InputGroup
                id="life-expectancy-input"
                value={data.lifeExpectancy?.toString() || ""}
                onChange={(e) => handleInputChange("lifeExpectancy", e.target.value)}
              />
            </FormGroup>
            <FormGroup label={schema.properties.age.title}  labelFor="age-input">
              <InputGroup
                id="age-input"
                value={data.age?.toString() || ""}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </FormGroup>
          </div>
        </Collapse>
        <div id="chart-holder" style={{  margin: '10px auto' }}>
        <StackedBarChart />
        </div>
      </div>
    </div>
  );
};

export default App;