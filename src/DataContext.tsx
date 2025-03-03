import React, { createContext, useState, useContext, ReactNode } from 'react';
import { validateData } from './validation';
import schema from './schema.json';
import Ajv from 'ajv';

interface DataContextType {
  data: { startYear?: number; lifeExpectancy?: number; age?: number };
  setData: (data: { startYear?: number; lifeExpectancy?: number; age?: number }) => void;
  loadFile: (file: File) => void;
  saveFile: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const ajv = new Ajv({ useDefaults: true });
const validate = ajv.compile(schema);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const defaultData = {
    startYear: schema.properties.startYear.default,
    lifeExpectancy: schema.properties.lifeExpectancy.default,
    age: schema.properties.age.default,
  };

  const [data, setData] = useState<{ startYear?: number; lifeExpectancy?: number; age?: number }>(defaultData);

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const jsonData = JSON.parse(content);
      if (validate(jsonData)) {
        setData(jsonData);
      } else {
        console.error('Invalid JSON data:', validate.errors);
      }
    };
    reader.readAsText(file);
  };

  const saveFile = () => {
    const jsonData = JSON.stringify(data, null, 2); // Format JSON with 2 spaces for readability
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider value={{ data, setData, loadFile, saveFile }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
