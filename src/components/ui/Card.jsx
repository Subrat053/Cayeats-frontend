const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  onClick,
  ...props 
}) => {
  const paddingSizes = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverStyles = hover 
    ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
    : '';

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 ${paddingSizes[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
