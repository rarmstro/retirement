import React, { createContext, useState, useContext, ReactNode } from "react";
import Ajv, { ValidateFunction } from "ajv";

interface DataContextType {
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
  loadFile: (file: File) => void;
  saveFile: () => void;
  loadSchema: (file: File) => void;
  schema: Record<string, any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const ajv = new Ajv({ useDefaults: true });
let validate: ValidateFunction;

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [schema, setSchema] = useState<any>(null);

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const jsonData = JSON.parse(content) as Record<string, any>;
      if (!validate || (validate && validate(jsonData))) {
        setData(jsonData);
        console.log(jsonData);
      } else {
        console.error("Invalid JSON data:", validate?.errors);
      }
    };
    reader.readAsText(file);
  };

  const saveFile = () => {
    const jsonData = JSON.stringify(data, null, 2); // Format JSON with 2 spaces for readability
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "retirement-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSchema = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonSchema = JSON.parse(content);
        validate = ajv.compile(jsonSchema);
        setSchema(jsonSchema);
        setData({});
      } catch (error) {
        console.error("Error loading schema:", error);
        setSchema(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <DataContext.Provider
      value={{ data, setData, loadFile, saveFile, loadSchema, schema }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
