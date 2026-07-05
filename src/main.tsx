import { createRoot } from "react-dom/client";
import "./index.css";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

async function boot() {
  try {
    const { bootstrapAdapters } = await import('./lib/bootstrapAdapters');
    bootstrapAdapters();

    const { default: App } = await import("./App.tsx");
    root.render(<App />);
  } catch (error) {
    console.error("Failed to boot application:", error);
    // When config fails during module evaluation (e.g. Supabase keys), 
    // the React ErrorBoundary is never reached. Render a fallback UI directly.
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #09090b; color: #fafafa; padding: 1.5rem; font-family: ui-sans-serif, system-ui, sans-serif;">
        <div style="max-w-sm; text-align: center; display: flex; flex-direction: column; gap: 1rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600;">Configuration Error</h2>
          <p style="font-size: 0.875rem; color: #a1a1aa; max-width: 400px;">
            ${error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    `;
  }
}

boot();
