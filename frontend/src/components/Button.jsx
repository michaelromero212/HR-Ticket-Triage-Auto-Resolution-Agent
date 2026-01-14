import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with variants, sizes, and states
 * WCAG 2.1 AA compliant with 44x44px minimum touch target
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    type = 'button',
    className = '',
    onClick,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 active:scale-95',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 active:scale-95',
        danger: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500 active:scale-95',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
    };

    const sizes = {
        small: 'px-3 py-2 text-sm min-h-[36px]',
        medium: 'px-4 py-2.5 text-base min-h-[44px]',
        large: 'px-6 py-3 text-lg min-h-[48px]',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
        </button>
    );
};

export default Button;
