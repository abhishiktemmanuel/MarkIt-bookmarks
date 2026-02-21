import { useState } from "react";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div onClick={() => setIsAuthenticated(true)}>
        <AuthPage />
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
