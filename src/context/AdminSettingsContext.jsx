import { createContext, useContext, useState } from 'react';
import { adminSettings as defaultSettings } from '../data/mockData';

const AdminSettingsContext = createContext(null);

export function AdminSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('cayeats_admin_settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('cayeats_admin_settings', JSON.stringify(newSettings));
  };

  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem('cayeats_admin_settings', JSON.stringify(merged));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.setItem('cayeats_admin_settings', JSON.stringify(defaultSettings));
  };

  return (
    <AdminSettingsContext.Provider value={{ 
      settings, 
      updateSetting, 
      updateSettings,
      resetToDefaults,
    }}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const context = useContext(AdminSettingsContext);
  if (!context) {
    throw new Error('useAdminSettings must be used within an AdminSettingsProvider');
  }
  return context;
}
