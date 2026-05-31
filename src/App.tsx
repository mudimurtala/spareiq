import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const HomePage = lazy(() =>
  import("./pages").then((m) => ({ default: m.HomePage })),
);
const PartsPage = lazy(() =>
  import("./pages/parts").then((m) => ({ default: m.PartsPage })),
);
const PartDetailPage = lazy(() => import("./pages/partDetail"));
const AiFinderPage = lazy(() =>
  import("./pages/aiFinder").then((m) => ({ default: m.AiFinderPage })),
);
const LoginPage = lazy(() =>
  import("./pages/login").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("./pages/dashboard").then((m) => ({ default: m.DashboardPage })),
);
const InventoryPage = lazy(() =>
  import("./pages/dashboard/InventoryPage").then((m) => ({
    default: m.InventoryPage,
  })),
);
const AddPartPage = lazy(() =>
  import("./pages/dashboard/AddPartPage").then((m) => ({
    default: m.AddPartPage,
  })),
);
const EditPartPage = lazy(() => import("./pages/dashboard/EditPartPage"));

import { ProtectedRoute } from "./components/ProtectedRoute";
import { Footer } from "./components/Footer";
import "./index.css";

// Layout component for public pages with footer
function PublicLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-accent-500 border-t-transparent animate-spin" />
          </div>
        }
      >
        <Router>
          <Routes>
            {/* Public Routes with Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/parts" element={<PartsPage />} />
              <Route path="/parts/:id" element={<PartDetailPage />} />
              <Route path="/ai-finder" element={<AiFinderPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected Routes (no footer) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/inventory"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/inventory/new"
              element={
                <ProtectedRoute>
                  <AddPartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/inventory/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPartPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
