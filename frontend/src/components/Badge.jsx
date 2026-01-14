import React from 'react';

/**
 * Badge component for status indicators
 * Semantic colors for ticket statuses and urgency levels
 */
const Badge = ({
    children,
    variant = 'default',
    icon: Icon,
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    const variants = {
        default: 'bg-gray-100 text-gray-800',
        new: 'bg-blue-100 text-blue-800',
        inProgress: 'bg-warning-50 text-warning-600',
        resolved: 'bg-success-50 text-success-600',
        escalated: 'bg-danger-50 text-danger-600',
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800',
    };

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    return (
        <span className={classes} {...props}>
            {Icon && <Icon className="w-3 h-3 mr-1" />}
            {children}
        </span>
    );
};

export default Badge;
