import { Link } from "react-router-dom";

const CuisineCard = ({ cuisine, variant = "default", className = "" }) => {
  const { id, name, icon, image, count } = cuisine;

  if (variant === "compact") {
    return (
      <Link
        to={`/cuisines/${id}`}
        className={`flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group ${className}`}
      >
        <span className="text-3xl group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
          {name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/cuisines/${id}`}
      className={`group relative block rounded-2xl overflow-hidden aspect-[4/3] ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <h3 className="text-xl font-bold text-center">{name}</h3>
        <p className="text-sm text-white/80 mt-1">
          {count} restaurant{count !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};

export default CuisineCard;
