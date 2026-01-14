import React, { useState } from 'react';
import { Loader2, Send, AlertCircle, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import { ticketService } from '../services/api';

/**
 * Multi-step ticket submission flow
 * Step 1: Initial input
 * Step 2: AI classification
 * Step 3: Auto-resolution or escalation
 */
const TicketSubmission = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        employee_name: '',
        department: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [ticket, setTicket] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'info' });

    const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations'];

    // Step 1: Initial form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const newErrors = {};
        if (!formData.employee_name.trim()) newErrors.employee_name = 'Name is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setStep(2); // Show AI analyzing

        try {
            // Submit to backend
            const response = await ticketService.submitTicket(formData);
            setTicket(response);

            // Move to result step after brief delay
            setTimeout(() => {
                setLoading(false);
                setStep(3);
            }, 2000);
        } catch (error) {
            setLoading(false);
            setStep(1);
            setToast({
                show: true,
                message: 'Failed to submit ticket. Please try again.',
                variant: 'error'
            });
        }
    };

    const handleFeedback = async (helpful) => {
        try {
            await ticketService.submitFeedback(ticket.id, { helpful });
            setToast({
                show: true,
                message: 'Thank you for your feedback!',
                variant: 'success'
            });
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to submit feedback',
                variant: 'error'
            });
        }
    };

    const handleReset = () => {
        setStep(1);
        setFormData({ employee_name: '', department: '', description: '' });
        setTicket(null);
        setErrors({});
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Ticket</h1>
                <p className="text-gray-600">
                    Get help with HR questions and requests. Our AI assistant will try to resolve your issue instantly.
                </p>
            </div>

            {/* Privacy notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">AI-Assisted Processing</p>
                        <p>
                            By submitting, you consent to AI-assisted processing. All data is encrypted and PII is automatically detected and redacted.
                            Human review is available upon request. <a href="/privacy" className="underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Step 1: Initial Input */}
            {step === 1 && (
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Your Name"
                            name="employee_name"
                            value={formData.employee_name}
                            onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                            error={errors.employee_name}
                            required
                            placeholder="e.g., Sarah Chen"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Department <span className="text-danger-500">*</span>
                            </label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            >
                                <option value="">Select your department</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            {errors.department && (
                                <p className="text-sm text-danger-600 mt-1.5">{errors.department}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                What can we help you with today? <span className="text-danger-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g., How do I request PTO for next week?"
                                maxLength={500}
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                            <div className="flex items-center justify-between mt-1.5">
                                <div>
                                    {errors.description && (
                                        <p className="text-sm text-danger-600">{errors.description}</p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {formData.description.length}/500
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button type="submit" icon={Send}>
                                Submit Ticket
                            </Button>
                            <a href="/knowledge-base" className="text-primary-600 hover:underline text-sm">
                                Or browse common topics
                            </a>
                        </div>
                    </form>
                </Card>
            )}

            {/* Step 2: AI Analyzing */}
            {step === 2 && (
                <Card>
                    <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your request...</h2>
                        <p className="text-gray-600">Our AI is classifying and attempting to resolve your ticket</p>
                    </div>
                </Card>
            )}

            {/* Step 3: Result */}
            {step === 3 && ticket && (
                <div className="space-y-6">
                    {/* Classification Result */}
                    <Card>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket #{ticket.id}</h2>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={statusToBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                                    <Badge variant={urgencyToBadgeVariant(ticket.urgency)}>{ticket.urgency}</Badge>
                                    <Badge>{ticket.category}</Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Confidence Score</p>
                                <p className="text-2xl font-bold text-primary-600">{ticket.confidence}%</p>
                            </div>
                        </div>

                        {/* PII Warning */}
                        {ticket.pii_detected && ticket.pii_detected.length > 0 && (
                            <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0" />
                                    <div className="text-sm text-warning-900">
                                        <p className="font-medium">Sensitive Information Detected</p>
                                        <p>We detected and redacted: {ticket.pii_detected.join(', ')}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sensitive Flag */}
                        {ticket.sensitive && (
                            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0" />
                                    <div className="text-sm text-danger-900">
                                        <p className="font-medium">Prioritized for Human Review</p>
                                        <p>This ticket involves sensitive topics and has been escalated to our HR team. You will be contacted within 2 hours.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Auto-Resolution */}
                    {ticket.auto_resolved && ticket.resolution && (
                        <Card>
                            <div className="flex items-start gap-3 mb-4">
                                <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Resolution</h3>
                                    <p className="text-sm text-gray-600">Based on our knowledge base</p>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none">
                                <div className="text-gray-700 whitespace-pre-line">
                                    {ticket.resolution.resolution}
                                </div>
                            </div>

                            {ticket.resolution.steps && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-900 mb-2">Step-by-Step:</p>
                                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                        {ticket.resolution.steps.map((step, idx) => (
                                            <li key={idx}>{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {ticket.resolution.sources && (
                                <div className="mt-4 text-sm text-gray-600">
                                    <p className="font-medium">Sources:</p>
                                    {ticket.resolution.sources.map((source, idx) => (
                                        <p key={idx}>• {source.file.replace('.md', '').replace('_', ' ')} - {source.section}</p>
                                    ))}
                                </div>
                            )}

                            {/* Feedback */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-900 mb-3">Was this resolution helpful?</p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="ghost"
                                        icon={ThumbsUp}
                                        onClick={() => handleFeedback(true)}
                                    >
                                        Yes, this helped
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        icon={ThumbsDown}
                                        onClick={() => handleFeedback(false)}
                                    >
                                        No, I need more help
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Escalation */}
                    {!ticket.auto_resolved && (
                        <Card>
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">We'll connect you with a specialist</h3>
                                <p className="text-gray-600 mb-6">
                                    Your ticket has been escalated to our {ticket.category} team.
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm">
                                    <span className="text-gray-600">Estimated response time:</span>
                                    <span className="font-semibold text-gray-900">4 hours</span>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button onClick={handleReset}>
                            Submit Another Ticket
                        </Button>
                        <Button variant="secondary" onClick={() => window.location.href = '/tickets'}>
                            View My Tickets
                        </Button>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <Toast
                isVisible={toast.show}
                message={toast.message}
                variant={toast.variant}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

// Helper functions
const statusToBadgeVariant = (status) => {
    const map = {
        'New': 'new',
        'In Progress': 'inProgress',
        'Resolved': 'resolved',
        'Escalated': 'escalated',
    };
    return map[status] || 'default';
};

const urgencyToBadgeVariant = (urgency) => {
    const map = {
        'Low': 'low',
        'Medium': 'medium',
        'High': 'high',
        'Critical': 'critical',
    };
    return map[urgency] || 'default';
};

export default TicketSubmission;
