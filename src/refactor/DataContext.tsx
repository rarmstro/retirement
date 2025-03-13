import React, { createContext, useContext, useState } from "react";
import Ajv from "ajv";

const ajv = new Ajv({ useDefaults: true });

interface DataContextType {
  schema: any;
  json: Record<string, any>;
  setJson: (data: Record<string, any>) => void;
  filename: string;
  uniqueKey: string;
  loadSchema: (file: File) => void;
  loadJson: (file: File) => void;
  saveJson: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [schema, setSchema] = useState<any>(null);
  const [json, setJson] = useState<Record<string, any>>({});
  const [filename, setFilename] = useState<string>("settings.json");

  const generateUniqueKey = (data: Record<string, any>): string => {
    // Create a consistent string representation of the JSON
    const jsonStr = JSON.stringify(data);
    // Simple hash function to generate a unique key
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Add timestamp for uniqueness
    return `${hash}`;
    // Add timestamp for uniqueness
    //return `${hash}-${Date.now()}`;
  };
  const [uniqueKey, setUniqueKey] = useState<string>(generateUniqueKey(json));

  // New helper function to combine setJson and setUniqueKey
  const updateJson = (data: Record<string, any>) => {
    setJson(data);
    const newKey = generateUniqueKey(data);
    if (newKey === uniqueKey) return;
    setUniqueKey(newKey);
    console.log("Updated JSON with new unique key:", newKey);
  };

  const loadSchema = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const schema = JSON.parse(reader.result as string);
        ajv.compile(schema);
        console.log("Schema is valid:");
        setSchema(schema);
        updateJson({});
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
        const jsonData = JSON.parse(content) as Record<string, any>;
        const valid = validate(jsonData);

        if (valid) {
          console.log("JSON data is valid");
          updateJson(jsonData); // Using the new helper function
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
      value={{
        schema,
        json,
        setJson,
        filename,
        uniqueKey,
        loadSchema,
        loadJson,
        saveJson,
      }}
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
