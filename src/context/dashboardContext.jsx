import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/me");
        setDashboardData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <DashboardContext.Provider
      value={{ dashboardData, loading, setDashboardData }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
