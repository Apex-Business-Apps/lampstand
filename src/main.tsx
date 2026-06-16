import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { bootstrapAdapters } from './lib/bootstrapAdapters';

bootstrapAdapters();
createRoot(document.getElementById("root")!).render(<App />);
