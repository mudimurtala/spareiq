import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "./pages";
import { PartsPage } from "./pages/parts";
import { PartDetailPage } from "./pages/partDetail";
import { AiFinderPage } from "./pages/aiFinder";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { InventoryPage } from "./pages/dashboard/InventoryPage";
import { AddPartPage } from "./pages/dashboard/AddPartPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./index.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/parts/:id" element={<PartDetailPage />} />
          <Route path="/ai-finder" element={<AiFinderPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
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
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
