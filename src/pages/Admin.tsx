// Legacy /admin route. The real admin lives at /admin/* under <AdminShell/>.
// This file exists only because some old bookmarks may still hit /admin
// directly through the lazy-imported route in App.tsx; the actual landing
// page is now <Dashboard/> mounted at the index route inside the shell.
// Kept as a re-export so the App.tsx import doesn't break during the
// transition.
export { default } from "./admin/Dashboard";
