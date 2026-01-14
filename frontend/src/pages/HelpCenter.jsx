import React from 'react';
import { HelpCircle, Mail, Phone, Clock } from 'lucide-react';
import Card from '../components/Card';

/**
 * Help Center Page
 */
const HelpCenter = () => {
    const faqs = [
        {
            question: "How do I submit a ticket?",
            answer: "Navigate to 'Submit Ticket' from the main menu, fill out the form with your question or request, and click submit. Our AI will analyze and attempt to resolve your ticket instantly."
        },
        {
            question: "How long does it take to get a response?",
            answer: "AI responses are instant (within seconds). If your ticket is escalated to a human agent, typical response time is 4 hours during business hours."
        },
        {
            question: "Can I edit a ticket after submission?",
            answer: "Currently, tickets cannot be edited after submission. If you need to update information, please submit a new ticket referencing the original ticket number."
        },
        {
            question: "What if the AI gives me the wrong answer?",
            answer: "Click 'Override AI Decision' on the ticket to escalate to a human agent. Your feedback helps us improve the system."
        },
        {
            question: "Is my data secure?",
            answer: "Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). PII is automatically detected and redacted. See our Privacy Policy for full details."
        },
        {
            question: "Can I opt out of AI processing?",
            answer: "Yes. Visit 'Data Privacy' and manage your AI processing preferences. Your tickets will route directly to human agents."
        },
        {
            question: "How accurate is the AI?",
            answer: "Our AI achieves 94.2% classification accuracy. Confidence scores are displayed on every ticket. We only auto-resolve when confidence is above 85%."
        },
        {
            question: "What happens to my tickets after they're resolved?",
            answer: "Resolved tickets are auto-deleted after 90 days. You can archive important tickets for future reference."
        },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
                <p className="text-gray-600">
                    Find answers to common questions or contact our support team
                </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card hover>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Mail className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                        <p className="text-sm text-gray-600 mb-2">Get help via email</p>
                        <a href="mailto:hrtech@company.com" className="text-primary-600 hover:underline text-sm">
                            hrtech@company.com
                        </a>
                    </div>
                </Card>

                <Card hover>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Phone className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                        <p className="text-sm text-gray-600 mb-2">Call us directly</p>
                        <a href="tel:x5500" className="text-primary-600 hover:underline text-sm">
                            x5500
                        </a>
                    </div>
                </Card>

                <Card hover>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                        <p className="text-sm text-gray-600">Mon-Fri</p>
                        <p className="text-sm text-gray-900 font-medium">9:00 AM - 5:00 PM EST</p>
                    </div>
                </Card>
            </div>

            {/* System Status */}
            <Card className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">System Status</h3>
                        <p className="text-sm text-gray-600">All systems operational</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                        <span className="text-sm font-medium text-success-600">Operational</span>
                    </div>
                </div>
            </Card>

            {/* FAQs */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6" />
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>

            {/* Additional Resources */}
            <Card className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Additional Resources</h3>
                <div className="space-y-2">
                    <a href="/knowledge-base" className="block text-primary-600 hover:underline">
                        → Browse Knowledge Base
                    </a>
                    <a href="/governance" className="block text-primary-600 hover:underline">
                        → AI Governance & Transparency
                    </a>
                    <a href="/privacy" className="block text-primary-600 hover:underline">
                        → Data Privacy Policy
                    </a>
                </div>
            </Card>
        </div>
    );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <Card hover onClick={() => setExpanded(!expanded)} className="cursor-pointer">
            <div>
                <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 pr-8">{question}</h3>
                    <span className="text-gray-400 text-xl flex-shrink-0">{expanded ? '−' : '+'}</span>
                </div>
                {expanded && (
                    <p className="mt-3 text-sm text-gray-700">{answer}</p>
                )}
            </div>
        </Card>
    );
};

export default HelpCenter;
