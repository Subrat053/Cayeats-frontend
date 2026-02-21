import { useState } from "react";
import { Eye, EyeOff, Save, RotateCcw, Info } from "lucide-react";
import { useAdminSettings } from "../../context/AdminSettingsContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Toggle from "../../components/ui/Toggle";

const AdminSettings = () => {
  const { settings, updateSetting, resetToDefaults } = useAdminSettings();
  const [saved, setSaved] = useState(false);

  const handleToggle = (key, value) => {
    updateSetting(key, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const displayToggles = [
    {
      key: "showHeroSection",
      label: "Hero Section",
      description: "Display the main hero banner on the homepage",
    },
    {
      key: "showTonightsCravings",
      label: "Tonight's Cravings",
      description: "Show promotional food placements section",
    },
    {
      key: "showFeaturedListings",
      label: "Featured Listings",
      description: "Display sponsored restaurant listings",
    },
    {
      key: "showTopBanner",
      label: "Top Banner Zone",
      description: "Show advertising banner at top of homepage",
    },
    {
      key: "showMiddleBanner",
      label: "Middle Banner Zone",
      description: "Show advertising banner in middle of homepage",
    },
    {
      key: "showBottomBanner",
      label: "Bottom Banner Zone",
      description: "Show advertising banner at bottom of homepage",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Platform Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Control visibility of platform features and sections
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Settings saved</span>
          </div>
        )}
      </div>

      {/* Launch Strategy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Launch Strategy</h3>
            <p className="text-sm text-blue-700 mt-1">
              At launch, all advertising sections should be toggled OFF to allow
              a clean launch focused on restaurant and delivery partner
              adoption. Enable them gradually as you onboard paying advertisers.
            </p>
          </div>
        </div>
      </div>

      {/* Display Toggles */}
      <Card>
        <Card.Header>
          <Card.Title>Homepage Display Settings</Card.Title>
          <Card.Description>
            Toggle visibility of homepage sections. Changes take effect
            immediately.
          </Card.Description>
        </Card.Header>
        <Card.Content className="pt-6">
          <div className="space-y-6">
            {displayToggles.map((toggle) => (
              <div
                key={toggle.key}
                className="flex items-start justify-between pb-6 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-1 pr-4">
                  <h4 className="font-medium text-gray-900">{toggle.label}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {toggle.description}
                  </p>
                </div>
                <Toggle
                  checked={settings[toggle.key]}
                  onChange={(value) => handleToggle(toggle.key, value)}
                />
              </div>
            ))}
          </div>
        </Card.Content>
        <Card.Footer>
          <Button variant="ghost" icon={RotateCcw} onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </Card.Footer>
      </Card>

      {/* Preview */}
      <Card>
        <Card.Header>
          <Card.Title>Current Configuration</Card.Title>
        </Card.Header>
        <Card.Content className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayToggles.map((toggle) => (
              <div
                key={toggle.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  settings[toggle.key]
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {settings[toggle.key] ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{toggle.label}</span>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AdminSettings;
