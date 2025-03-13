import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import "normalize.css"
import '@blueprintjs/core/lib/css/blueprint.css';

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Failed to find the app container");
}
