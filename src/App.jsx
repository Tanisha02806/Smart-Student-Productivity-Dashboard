import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { queryClientInstance } from "./lib/query-client";
import { AuthProvider, useAuth } from "./lib/AuthContext";

import { Toaster } from "./components/ui/toaster";
import AppLayout from "./components/layout/AppLayout";
import UserNotRegisteredError from "./components/UserNotRegisteredError";
import PageNotFound from "./lib/PageNotFound";

import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import AttendancePage from "./pages/AttendancePage";
import FocusTimer from "./pages/FocusTimer";
import Notes from "./pages/Notes";
import AIAssistant from "./pages/AIAssistant";

function AuthenticatedApp() {
  const {
    isLoadingAuth = false,
    authError = null,
  } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p>Loading StudyHub...</p>
        </div>
      </div>
    );
  }

  // authError may be of unknown shape; perform a safe runtime check
  if (typeof authError === "object" && authError !== null && "type" in authError && authError.type === "user_not_registered") {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/focus" element={<FocusTimer />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>

        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}