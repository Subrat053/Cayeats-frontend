import { useEffect } from "react";
import LoginPage from "./LoginPage";

/**
 * AdminLoginPage
 * Wrapper component that renders LoginPage with the role pre-set to "admin"
 */
const AdminLoginPage = () => {
  useEffect(() => {
    // Pre-select admin role by setting it in the form
    const roleSelect = document.querySelector('select[name="role"]');
    if (roleSelect) {
      roleSelect.value = "admin";
    }
  }, []);

  return <LoginPage />;
};

export default AdminLoginPage;
