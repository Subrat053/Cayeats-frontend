import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Star,
  Clock,
  Check,
  ChevronLeft,
  Share2,
  Heart,
  Navigation,
} from "lucide-react";
import { fetchRestaurantById } from "../api/browseServices";
import { DeliveryButtons } from "../components/restaurant/index";

// ✅ check open status from structured openingHours
const getOpenStatus = (openingHours) => {
  if (!openingHours) return { isOpen: false, message: "Hours not available" };
  const now = new Date();
  const day = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const time = now.toTimeString().slice(0, 5);
  const hours = openingHours[day];
  if (!hours || hours.closed) return { isOpen: false, message: "Closed today" };
  if (time < hours.open)
    return { isOpen: false, message: `Opens at ${hours.open}` };
  if (time > hours.close)
    return { isOpen: false, message: `Closed at ${hours.close}` };
  return { isOpen: true, message: `Open until ${hours.close}` };
};

const RestaurantDetailPage = () => {
  const { slug } = useParams(); // ✅ slug is actually _id from our routes
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchRestaurantById(slug)
      .then(setRestaurant)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  if (error || !restaurant)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Restaurant Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            {error ||
              "This restaurant doesn't exist or hasn't been approved yet."}
          </p>
          <Link
            to="/restaurants"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Browse All Restaurants
          </Link>
        </div>
      </div>
    );

  const {
    _id,
    fullName, // ✅ was "name"
    image,
    cuisineTypes, // ✅ was "cuisines"
    address,
    phone,
    email,
    website,
    instagram,
    rating,
    reviewCount,
    isFeatured,
    isVerified,
    openingHours, // ✅ was "hours"
    deliveryProviders,
  } = restaurant;

  const openStatus = getOpenStatus(openingHours);
  const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
          }
          alt={fullName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-3 rounded-lg backdrop-blur-sm transition-colors ${
              liked
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() =>
              navigator.share?.({ title: fullName, url: window.location.href })
            }
            className="p-3 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          {isFeatured && (
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              ⭐ Featured
            </span>
          )}
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              openStatus.isOpen
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {openStatus.isOpen ? "🟢 Open" : "🔴 Closed"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {fullName}
                    </h1>
                    {isVerified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cuisine Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {cuisineTypes?.map((cuisine) => (
                      <Link
                        key={cuisine}
                        to={`/cuisines/${encodeURIComponent(cuisine)}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {cuisine}
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{openStatus.message}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="text-center bg-gray-50 rounded-xl p-4 flex-shrink-0">
                  <div className="flex items-center gap-1 justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-gray-900">
                      {rating ?? "-"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {reviewCount ?? 0} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Order Online - Main CTA */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Order Online
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Choose your preferred delivery provider to place an order
              </p>
              <DeliveryButtons
                deliveryProviders={deliveryProviders}
                restaurantId={_id}
                restaurantName={fullName}
                size="lg"
              />
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Opening Hours
              </h2>
              {openingHours ? (
                <div className="space-y-2">
                  {DAYS.map((day) => {
                    const h = openingHours[day];
                    const isToday =
                      new Date()
                        .toLocaleDateString("en-US", { weekday: "long" })
                        .toLowerCase() === day;
                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between py-2 ${
                          isToday
                            ? "font-semibold text-orange-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="capitalize w-28">{day}</span>
                        <span>
                          {!h || h.closed ? "Closed" : `${h.open} – ${h.close}`}
                        </span>
                        {isToday && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full ml-2">
                            Today
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Hours not available</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Order Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-2">Ready to Order?</h3>
              <p className="text-orange-100 text-sm mb-4">
                Click below to order from your preferred delivery service
              </p>
              <DeliveryButtons
                deliveryProviders={deliveryProviders}
                restaurantId={_id}
                restaurantName={fullName}
                size="md"
              />
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact & Location
              </h3>
              <div className="space-y-4">
                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{address}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 text-sm hover:underline flex items-center gap-1 mt-1"
                      >
                        <Navigation className="w-3 h-3" /> Get Directions
                      </a>
                    </div>
                  </div>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gray-400" /> {phone}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-gray-400" /> {email}
                  </a>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-gray-400" /> Visit Website
                  </a>
                )}
                {instagram && (
                  <a
                    href={`https://instagram.com/${instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <span className="w-5 h-5 text-gray-400 text-center font-bold">
                      @
                    </span>
                    {instagram}
                  </a>
                )}
              </div>
            </div>

            {/* Map */}
            {address && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <iframe
                  title="Restaurant Location"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                />
              </div>
            )}

            {/* Claim Notice */}
            {!isVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Own this restaurant?
                </h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Claim your listing to manage your profile and purchase
                  advertising.
                </p>
                <Link
                  to="/register?type=restaurant"
                  className="block w-full text-center bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                >
                  Claim This Listing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
