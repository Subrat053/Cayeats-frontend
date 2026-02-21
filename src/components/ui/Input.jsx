import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helper,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseInputStyles = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed';
  
  const inputStyles = error 
    ? `${baseInputStyles} border-red-300 text-red-900 placeholder-red-300`
    : `${baseInputStyles} border-gray-300 text-gray-900 placeholder-gray-400`;

  const paddingStyles = Icon 
    ? iconPosition === 'left' ? 'pl-10 pr-4' : 'pl-4 pr-10'
    : 'px-4';

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`${inputStyles} ${paddingStyles} py-2.5 ${className}`}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
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

Input.displayName = 'Input';

export default Input;
