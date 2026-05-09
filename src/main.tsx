import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// Pages are prerendered to static HTML at build time so crawlers and the
// initial paint see fully-rendered content. We deliberately skip React
// hydration and re-render fresh on the client: the prerendered HTML is
// captured after useEffects have run, so the DOM doesn't match React's
// initial state and hydrateRoot would mismatch. Clearing and re-rendering
// is fast and avoids those mismatches at no visible cost.
container.innerHTML = "";
createRoot(container).render(<App />);
