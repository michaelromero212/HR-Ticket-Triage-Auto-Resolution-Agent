import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Toast notification component
 * Auto-dismisses after 5 seconds, supports manual dismiss
 */
const Toast = ({
    message,
    variant = 'info',
    isVisible,
    onClose,
    duration = 5000,
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const variants = {
        success: {
            icon: CheckCircle,
            classes: 'bg-success-50 text-success-800 border-success-200',
            iconColor: 'text-success-600',
        },
        error: {
            icon: AlertCircle,
            classes: 'bg-danger-50 text-danger-800 border-danger-200',
            iconColor: 'text-danger-600',
        },
        warning: {
            icon: AlertTriangle,
            classes: 'bg-warning-50 text-warning-800 border-warning-200',
            iconColor: 'text-warning-600',
        },
        info: {
            icon: Info,
            classes: 'bg-blue-50 text-blue-800 border-blue-200',
            iconColor: 'text-blue-600',
        },
    };

    const config = variants[variant];
    const Icon = config.icon;

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-slide-up ${config.classes}`}
            role="alert"
            aria-live="polite"
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
