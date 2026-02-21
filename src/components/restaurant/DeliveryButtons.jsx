import { ExternalLink, Star } from "lucide-react";
import { trackDeliveryClick } from "../../api/browseServices";

const DeliveryButtons = ({
  deliveryProviders = [], // ✅ array from backend [{providerName, orderUrl, isPreferred, clickCount}]
  restaurantId, // ✅ for click tracking
  restaurantName,
  size = "md",
  className = "",
}) => {
  // ✅ filter to only providers that have an orderUrl set by admin
  const activeProviders = deliveryProviders
    .filter((p) => p.orderUrl)
    .sort((a, b) => {
      // ✅ preferred always first
      if (a.isPreferred && !b.isPreferred) return -1;
      if (!a.isPreferred && b.isPreferred) return 1;
      return 0;
    });

  if (activeProviders.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-2">
        No delivery options available yet
      </p>
    );
  }

  const handleClick = (providerName) => {
    // ✅ fire and forget - track click for analytics
    if (restaurantId) {
      trackDeliveryClick(restaurantId, providerName);
    }
  };

  const sizes = {
    sm: { button: "px-3 py-1.5 text-xs", icon: "w-3 h-3" },
    md: { button: "px-4 py-2 text-sm", icon: "w-4 h-4" },
    lg: { button: "px-5 py-2.5 text-sm", icon: "w-4 h-4" },
  };
  const s = sizes[size] || sizes.md;

  // provider brand colors
  const PROVIDER_COLORS = {
    bento: "#ff6b35",
    "lets eat": "#22c55e",
    letseat: "#22c55e",
    default: "#6366f1",
  };

  const getColor = (name) =>
    PROVIDER_COLORS[name?.toLowerCase()] || PROVIDER_COLORS.default;

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        Order via
      </p>
      <div className="flex flex-wrap gap-2">
        {activeProviders.map((provider) => {
          const color = getColor(provider.providerName);
          const isPreferred = provider.isPreferred;

          return (
            <a
              key={provider.providerName}
              href={provider.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Order ${restaurantName} from ${provider.providerName}`}
              onClick={() => handleClick(provider.providerName)}
              className={`
                relative inline-flex items-center gap-2 font-medium rounded-lg border-2
                transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                ${
                  isPreferred
                    ? `${s.button} text-white`
                    : `${s.button} bg-white text-gray-700 hover:bg-gray-50`
                }
              `}
              style={
                isPreferred
                  ? { backgroundColor: color, borderColor: color }
                  : { borderColor: color + "60" }
              }
            >
              {/* ✅ Preferred badge - 40% larger feel via padding + star */}
              {isPreferred && (
                <Star className="w-4 h-4 fill-white text-white" />
              )}

              <span
                style={!isPreferred ? { color } : {}}
                className="font-semibold"
              >
                {provider.providerName}
              </span>

              <ExternalLink className={`${s.icon} opacity-50`} />

              {isPreferred && (
                <span
                  className="absolute -top-2.5 -right-2.5 bg-white text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-sm border"
                  style={{ color, borderColor: color }}
                >
                  Preferred
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryButtons;
