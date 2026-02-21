const Toggle = ({ 
  checked, 
  onChange, 
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: {
      toggle: 'w-8 h-5',
      dot: 'w-3 h-3',
      translate: 'translate-x-3.5',
    },
    md: {
      toggle: 'w-11 h-6',
      dot: 'w-4 h-4',
      translate: 'translate-x-5',
    },
    lg: {
      toggle: 'w-14 h-7',
      dot: 'w-5 h-5',
      translate: 'translate-x-7',
    },
  };

  const currentSize = sizes[size];

  return (
    <label className={`flex items-start gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div 
          className={`${currentSize.toggle} rounded-full transition-colors duration-200 border-2 ${
            checked 
              ? 'bg-primary-500 border-primary-600' 
              : 'bg-gray-200 border-gray-300'
          } ${disabled ? 'opacity-50' : ''}`}
        />
        <div 
          className={`absolute top-1 left-1 ${currentSize.dot} rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? currentSize.translate : 'translate-x-0'
          }`}
        />
      </div>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {label}
            </span>
          )}
          {description && (
            <span className={`block text-sm ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

export default Toggle;
