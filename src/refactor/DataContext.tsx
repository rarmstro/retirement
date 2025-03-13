import React, { createContext, useContext, useState } from "react";
import Ajv from "ajv";

const ajv = new Ajv({ useDefaults: true });

interface DataContextType {
  schema: any;
  json: any;
  filename: string;
  loadSchema: (file: File) => void;
  loadJson: (file: File) => void;
  saveJson: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [schema, setSchema] = useState<any>(null);
  const [json, setJson] = useState<any>(null);
  const [filename, setFilename] = useState<string>("settings.json");

  const loadSchema = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const schema = JSON.parse(reader.result as string);
        ajv.compile(schema);
        console.log("Schema is valid:");
        setSchema(schema);
        setJson(null);
      } catch (error) {
        console.error("Error parsing schema:", error);
      }
    };
    reader.readAsText(file);
  };

  const loadJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const validate = ajv.compile(schema);
        const content = reader.result as string;
        const jsonData = JSON.parse(content);
        const valid = validate(jsonData);

        if (valid) {
          console.log("JSON data is valid");
          setJson(jsonData);
          setFilename(file.name);
        } else {
          console.error("Invalid JSON data:", validate?.errors);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };

  const saveJson = () => {
    const jsonData = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider
      value={{ schema, json, filename, loadSchema, loadJson, saveJson }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
