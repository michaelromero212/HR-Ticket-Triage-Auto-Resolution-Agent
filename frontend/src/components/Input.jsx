import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Form Input component with validation states
 * WCAG compliant with proper labels and ARIA attributes
 */
const Input = ({
    label,
    id,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    helperText,
    error,
    success,
    required = false,
    disabled = false,
    maxLength,
    showCharCount = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);

    const inputClasses = `
    w-full px-4 py-2.5 rounded-lg border transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError ? 'border-danger-500 focus:ring-danger-500' : ''}
    ${hasSuccess ? 'border-success-500 focus:ring-success-500' : ''}
    ${!hasError && !hasSuccess ? 'border-gray-300 focus:ring-primary-500' : ''}
    ${Icon ? 'pl-10' : ''}
    ${className}
  `;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    {label}
                    {required && <span className="text-danger-500 ml-1" aria-label="required">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}

                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur && onBlur(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    className={inputClasses}
                    aria-invalid={hasError}
                    aria-describedby={
                        hasError ? `${inputId}-error` :
                            helperText ? `${inputId}-helper` :
                                undefined
                    }
                    {...props}
                />

                {hasError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-danger-500">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                )}

                {hasSuccess && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success-500">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-1.5">
                <div className="flex-1">
                    {hasError && (
                        <p id={`${inputId}-error`} className="text-sm text-danger-600" role="alert">
                            {error}
                        </p>
                    )}

                    {!hasError && helperText && (
                        <p id={`${inputId}-helper`} className="text-sm text-gray-500">
                            {helperText}
                        </p>
                    )}
                </div>

                {showCharCount && maxLength && (
                    <p className="text-sm text-gray-500 ml-2">
                        {value?.length || 0}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Input;
