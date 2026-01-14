import React from 'react';

/**
 * Card component with header, body, and footer sections
 * Includes hover effects and loading skeleton support
 */
const Card = ({
    children,
    header,
    footer,
    hover = false,
    loading = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden';
    const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-lift hover:-translate-y-1 cursor-pointer' : '';

    if (loading) {
        return (
            <div className={`${baseClasses} ${className}`}>
                <div className="p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
            {header && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    {header}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
