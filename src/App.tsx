import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Visualization from "./pages/Visualization/Visualization";
import VisualizationClassroom from "./pages/Visualization/VisualizationClassroom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Manage from "./pages/Manage/Manage";
import ClassroomDashboard from "./pages/ClassroomDashboard/ClassroomDashboard";
import Assginment from "./pages/Assignment/Assignment";
import Clssroom from "./pages/Classroom/Classroom";
import AuthEmail from "./pages/AuthEmail/AuthEmail";

import { useUserStore } from "./store/user";
import { useMswReadyStore } from "@/store/mswReady";
import "./App.css";

import { setupMSW } from "./mocks/setup";
import { getUser } from "@/services/api";

interface User {
  email: string;
  name: string;
  role: string;
}

function App() {
  const { isMswReady, setIsMswReady } = useMswReadyStore((state) => state);

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

  const { data } = useQuery<User>({ queryKey: ["user"], queryFn: getUser, enabled: isMswReady });
  const setUserEmail = useUserStore((state) => state.setUserEmail);
  const setUserName = useUserStore((state) => state.setUserName);
  const setUserRole = useUserStore((state) => state.setUserRole);

  useEffect(() => {
    if (data) {
      setUserEmail(data.email);
      setUserName(data.name);
      setUserRole(data.role);
    }
  }, [data]);

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
        <Route path="/assignment" element={<Assginment />} />
        <Route path="/auth/email" element={<AuthEmail />} />
        <Route path="/classroomdashboard/classroom/:classroomId" element={<Clssroom />} />
      </Routes>
    </Router>
  );
}

export default App;
