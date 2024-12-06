import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Visualization from "./pages/Visualization/Visualization";
import VisualizationClassroom from "./pages/Visualization/VisualizationClassroom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Manage from "./pages/Manage/Manage";
import ClassroomDashboard from "./pages/ClassroomDashboard/ClassroomDashboard";
import Assignment from "./pages/Assignment/Assignment";
import Classroom from "./pages/Classroom/Classroom";
import AuthEmail from "./pages/AuthEmail/AuthEmail";

import { useMswReadyStore } from "@/store/mswReady";
import "./App.css";
import { setupMSW } from "./mocks/setup";

export interface User {
  code: string;
  detail: string;
  result: {
    email: string;
    name: string;
    role: string;
    provider: string;
  } | null;
}

function App() {
  const { setIsMswReady } = useMswReadyStore((state) => state);

  useEffect(() => {
    async function initializeMSW() {
      if (typeof window !== "undefined") {
        if (import.meta.env.VITE_APP_NODE_ENV === "development") {
          await setupMSW();
        }
        setIsMswReady(true);
      }
    }

    initializeMSW();
  }, [setIsMswReady]);

  if (import.meta.env.VITE_APP_NODE_PRODUCTION === "production") {
    // Disable all console methods
    console = {
      ...console,
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {},
      debug: () => {},
      trace: () => {},
    };

    // Suppress any uncaught errors in production
    window.onerror = () => true;
    window.onunhandledrejection = () => true;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viz" element={<Visualization />} />
        <Route path="/classroomdashboard/classroom/viz/:classroomId" element={<VisualizationClassroom />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/classroomdashboard/classroom/manage/:classroomId" element={<Manage />} />
        <Route path="/classroomdashboard" element={<ClassroomDashboard />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/auth/email" element={<AuthEmail />} />
        <Route path="/classroomdashboard/classroom/:classroomId" element={<Classroom />} />
      </Routes>
    </Router>
  );
}

export default App;
