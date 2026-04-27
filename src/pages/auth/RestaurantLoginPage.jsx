import { useEffect } from "react";
import LoginPage from "./LoginPage";

/**
 * RestaurantLoginPage
 * Wrapper component that renders LoginPage with the role pre-set to "restaurant"
 */
const RestaurantLoginPage = () => {
  useEffect(() => {
    // Pre-select restaurant role by setting it in the form
    const roleSelect = document.querySelector('select[name="role"]');
    if (roleSelect) {
      roleSelect.value = "restaurant";
    }
  }, []);

  return <LoginPage />;
};

export default RestaurantLoginPage;
