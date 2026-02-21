import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ 
  label,
  error,
  helper,
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseStyles = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white';
  
  const selectStyles = error 
    ? `${baseStyles} border-red-300 text-red-900`
    : `${baseStyles} border-gray-300 text-gray-900`;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`${selectStyles} px-4 py-2.5 pr-10 ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
