import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "./pages";
import { PartsPage } from "./pages/parts";
import { PartDetailPage } from "./pages/partDetail";
import { AiFinderPage } from "./pages/aiFinder";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
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
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
