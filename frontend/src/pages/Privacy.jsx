import React from 'react';
import { Lock, Shield, Eye, Database, Clock, UserX } from 'lucide-react';
import Card from '../components/Card';

/**
 * Data Privacy Page
 * Explains data privacy practices and PII protection
 */
const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Privacy</h1>
                <p className="text-gray-600">
                    Your privacy and data security are our top priorities
                </p>
            </div>

            {/* Privacy Commitment */}
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <Lock className="w-6 h-6 text-primary-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-primary-900 mb-1">Our Privacy Commitment</h3>
                        <p className="text-sm text-primary-800">
                            All data is encrypted at rest and in transit (TLS 1.3). PII is automatically detected and redacted.
                            We collect only data necessary for ticket resolution and never share with third parties.
                        </p>
                    </div>
                </div>
            </div>

            {/* PII Protection */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary-600" />
                    PII Detection & Protection
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Automatically Detected & Redacted:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <PIIItem icon="🔢" text="Social Security Numbers (SSN)" />
                            <PIIItem icon="💳" text="Credit card numbers" />
                            <PIIItem icon="🏦" text="Bank account numbers" />
                            <PIIItem icon="💰" text="Salary & compensation amounts" />
                            <PIIItem icon="🏥" text="Medical information" />
                            <PIIItem icon="📅" text="Dates of birth" />
                            <PIIItem icon="🏠" text="Home addresses" />
                            <PIIItem icon="📧" text="Personal email addresses" />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">How It Works:</h4>
                        <p className="text-sm text-gray-700 mb-2">
                            Our system uses pattern matching and Named Entity Recognition (NER) to identify PII in your ticket description.
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Example:</strong> "My SSN is 123-45-6789" becomes "My SSN is [REDACTED-SSN-6789]"
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Storage:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Redacted versions displayed in UI and logs</li>
                            <li>Original text stored encrypted in secure database</li>
                            <li>Access limited to authorized HR personnel only</li>
                            <li>All access logged for audit purposes</li>
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Data Collection */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="w-6 h-6 text-primary-600" />
                    What Data We Collect
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Ticket Information:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Employee name and department (for routing)</li>
                            <li>Ticket description (your question or request)</li>
                            <li>Timestamp and urgency level</li>
                            <li>AI classification and confidence score</li>
                            <li>Resolution provided and feedback received</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Analytics Data:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Aggregated ticket volumes by category and department</li>
                            <li>Resolution rates and response times (anonymized)</li>
                            <li>Satisfaction scores (not linked to individuals)</li>
                            <li>System performance metrics</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                            <strong>Data Minimization:</strong> We only collect information necessary for ticket resolution and system improvement.
                            No browsing history, location data, or unrelated personal information is collected.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Data Retention */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary-600" />
                    Data Retention
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Automatic Deletion:</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Resolved tickets:</strong> Auto-deleted after 90 days
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Escalated tickets:</strong> Retained for 1 year (compliance requirement)
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Analytics data:</strong> Anonymized and aggregated after 30 days
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Archive Option:</h3>
                        <p className="text-sm text-gray-700">
                            Tickets can be archived for future reference instead of deleted. Archived tickets are encrypted and
                            accessible only with your consent.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Your Rights */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-primary-600" />
                    Your Rights
                </h2>

                <div className="space-y-3">
                    <RightItem
                        title="Right to Access"
                        description="Request a copy of all data we have about you. Email privacy@company.com."
                    />
                    <RightItem
                        title="Right to Deletion"
                        description="Request deletion of your tickets and personal data (subject to legal retention requirements)."
                    />
                    <RightItem
                        title="Right to Correction"
                        description="Request correction of inaccurate personal information in your tickets."
                    />
                    <RightItem
                        title="Right to Portability"
                        description="Request your data in a machine-readable format for transfer to another system."
                    />
                    <RightItem
                        title="Right to Object"
                        description="Object to AI processing of your tickets and request human-only review."
                    />
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>To exercise your rights:</strong> Email privacy@company.com or contact your HR representative.
                        We will respond within 30 days.
                    </p>
                </div>
            </Card>

            {/* Opt-Out */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserX className="w-6 h-6 text-primary-600" />
                    Opt-Out of AI Processing
                </h2>

                <p className="text-gray-700 mb-4">
                    You can opt out of AI-assisted processing at any time. Your tickets will be routed directly to human HR agents
                    without AI classification or auto-resolution attempts.
                </p>

                <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg mb-4">
                    <p className="text-sm text-warning-900">
                        <strong>Note:</strong> Opting out may result in longer response times (human agents vs. instant AI responses).
                        You can opt back in at any time.
                    </p>
                </div>

                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Manage AI Processing Preferences
                </button>
            </Card>

            {/* Encryption */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-primary-600" />
                    Encryption & Security
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Data in Transit:</h3>
                        <p className="text-sm text-gray-700">
                            All data transmitted between your browser and our servers is encrypted using TLS 1.3
                            (Transport Layer Security), the strongest available encryption protocol.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Data at Rest:</h3>
                        <p className="text-sm text-gray-700">
                            All tickets and personal data are encrypted in our database using AES-256 encryption.
                            Encryption keys are rotated quarterly.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Access Controls:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Role-based access: Employees see only their own tickets</li>
                            <li>HR agents have access to all tickets in their assigned categories</li>
                            <li>System administrators have audit logs of all access</li>
                            <li>Multi-factor authentication (MFA) required for all users</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// PII Item Component
const PIIItem = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="text-xl">{icon}</span>
        <span>{text}</span>
    </div>
);

// Right Item Component
const RightItem = ({ title, description }) => (
    <div className="flex items-start gap-3">
        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
        <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-700 mt-1">{description}</p>
        </div>
    </div>
);

export default Privacy;
