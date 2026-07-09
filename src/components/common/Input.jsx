// src/components/common/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      error,
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed';

    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 hover:border-gray-400';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />

        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;