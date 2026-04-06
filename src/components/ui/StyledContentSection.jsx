import MarkdownRenderer from "./MarkdownRenderer";

/**
 * StyledContentSection Component
 *
 * Renders content items in beautiful dark boxes with bold headings
 * Supports both plain text and markdown rendering
 * Perfect for FAQs, features, benefits, etc.
 */
export const StyledContentBox = ({
  title,
  description,
  markdown = false,
  className = "",
}) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      {markdown ? (
        <div className="text-gray-300">
          <MarkdownRenderer content={description} />
        </div>
      ) : (
        <p className="text-gray-400 leading-relaxed">{description}</p>
      )}
    </div>
  );
};

/**
 * StyledSection Component
 *
 * Wraps multiple content items in a organized grid layout
 * Includes title and description for the section
 */
export const StyledSection = ({
  title,
  description,
  children,
  columns = 2,
  className = "",
}) => {
  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
            {description && (
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        <div
          className={`grid grid-cols-1 md:grid-cols-${columns} lg:grid-cols-${columns} gap-6`}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

/**
 * StyledFeatureBox Component
 *
 * For displaying features with icons
 * Used in marketing/feature sections
 */
export const StyledFeatureBox = ({
  icon: Icon,
  title,
  description,
  className = "",
}) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500/30 transition-colors ${className}`}
    >
      {Icon && (
        <div className="p-3 bg-orange-500/20 rounded-lg w-fit mb-4">
          <Icon className="w-6 h-6 text-orange-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

/**
 * StyledFAQItem Component
 *
 * For FAQ sections with nice styling
 * Can be expanded/collapsed
 */
export const StyledFAQItem = ({
  question,
  answer,
  markdown = false,
  expanded = false,
  onToggle = () => {},
}) => {
  return (
    <div
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="text-lg font-semibold text-white mb-3">{question}</h3>
      {expanded && (
        <div className="text-gray-300">
          {markdown ? (
            <MarkdownRenderer content={answer} />
          ) : (
            <p className="text-gray-400 leading-relaxed">{answer}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StyledContentBox;
