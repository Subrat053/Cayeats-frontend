import { Link } from "react-router-dom";
import { Star, Check, Award, Heart } from "lucide-react";
import DeliveryButtons from "./DeliveryButtons";
import { useFavorites } from "../../context/FavoritesContext";

// ✅ helper - check if restaurant is open right now
const checkIsOpen = (openingHours) => {
  if (!openingHours) return false;
  const now = new Date();
  const day = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const time = now.toTimeString().slice(0, 5);
  const hours = openingHours[day];
  if (!hours || hours.closed) return false;
  return time >= hours.open && time <= hours.close;
};

const RestaurantCard = ({
  restaurant,
  variant = "default",
  showDeliveryButtons = true,
  className = "",
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  // ✅ map backend fields correctly
  const {
    _id,
    fullName, // ✅ was "name"
    image,
    profileImage,
    cuisineTypes, // ✅ was "cuisines"
    rating,
    reviewCount,
    isVerified,
    address,
    openingHours, // ✅ was "hours"
    deliveryProviders,
    isFeatured,
  } = restaurant;

  const isOpen = checkIsOpen(openingHours);
  const isLiked = isFavorite(_id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(_id);
  };

  // ✅ use _id as slug since we don't have a slug field
  const href = `/restaurant/${_id}`;

  if (variant === "compact") {
    return (
      <Link
        to={href}
        className={`group flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all ${className}`}
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={
              profileImage ||
              image ||
              "https://placehold.co/400x250/f97316/ffffff?text=No+Image"
            }
            alt={fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
            {isVerified && (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-medium ${isOpen ? "text-green-600" : "text-red-500"}`}
            >
              {isOpen ? "Open" : "Closed"}
            </span>
            {cuisineTypes?.[0] && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">{cuisineTypes[0]}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium text-gray-900">{rating ?? "-"}</span>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 ${className}`}
    >
      {/* Image */}
      <Link to={href} className="block relative">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={
              profileImage ||
              image ||
              "https://placehold.co/400x250/f97316/ffffff?text=No+Image"
            }
            alt={fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              <Award className="w-3 h-3" /> Featured
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isOpen ? "● Open" : "● Closed"}
          </span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
            isLiked
              ? "bg-red-500 text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={href}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-orange-500 transition-colors">
                {fullName}
              </h3>
              {isVerified && (
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900 text-sm">
                {rating ?? "-"}
              </span>
              <span className="text-gray-400 text-xs">
                ({reviewCount ?? 0})
              </span>
            </div>
          </div>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {cuisineTypes?.slice(0, 3).map((cuisine) => (
              <span
                key={cuisine}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {cuisine}
              </span>
            ))}
          </div>

          {/* Address */}
          {address && (
            <p className="text-xs text-gray-400 mb-3 truncate">{address}</p>
          )}
        </Link>

        {/* Delivery Buttons */}
        {showDeliveryButtons && deliveryProviders?.length > 0 && (
          <DeliveryButtons
            deliveryProviders={deliveryProviders}
            restaurantId={_id} // ✅ for click tracking
            restaurantName={fullName}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
