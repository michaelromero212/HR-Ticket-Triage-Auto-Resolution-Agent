import React from 'react';
import { Shield, CheckCircle, AlertTriangle, Users, BarChart3 } from 'lucide-react';
import Card from '../components/Card';

/**
 * AI Governance Page
 * Explains responsible AI practices, transparency, and oversight
 */
const Governance = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Governance</h1>
                <p className="text-gray-600">
                    Our commitment to responsible, fair, and transparent AI
                </p>
            </div>

            {/* Responsible AI Principles */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary-600" />
                    Our Responsible AI Principles
                </h2>
                <div className="space-y-4">
                    <PrincipleItem
                        title="Fairness"
                        description="Our AI is trained to provide equitable service across all employee groups, departments, and seniority levels. We monitor for disparate impact and ensure consistent resolution rates."
                    />
                    <PrincipleItem
                        title="Transparency"
                        description="We explain AI decisions with confidence scores, reasoning, and sources. You always know when AI is involved and can request human review."
                    />
                    <PrincipleItem
                        title="Accountability"
                        description="Clear ownership by People Operations Technology Team. All AI errors and concerns can be reported via hrtech@company.com."
                    />
                    <PrincipleItem
                        title="Safety"
                        description="Sensitive topics (harassment, discrimination, safety) are immediately escalated to humans. Content filters prevent inappropriate responses."
                    />
                    <PrincipleItem
                        title="Privacy"
                        description="PII is automatically detected and redacted. AI only accesses information necessary for resolution."
                    />
                </div>
            </Card>

            {/* Model Transparency */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary-600" />
                    Model Transparency
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">AI Model Information</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Model:</strong> Google Gemini Pro</li>
                            <li><strong>Version:</strong> 2.3.1</li>
                            <li><strong>Last Updated:</strong> January 10, 2026</li>
                            <li><strong>Training Data:</strong> 10,000+ historical HR tickets</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Current Performance</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Classification Accuracy:</strong> 94.2%</li>
                            <li><strong>Resolution Accuracy:</strong> 94.2%</li>
                            <li><strong>Deflection Rate:</strong> 62%</li>
                            <li><strong>Employee Satisfaction:</strong> 4.6/5.0</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                        <strong>How it works:</strong> Our AI analyzes your ticket description, classifies it into one of 15 HR categories,
                        and searches our knowledge base for relevant policy information to provide accurate, grounded responses with citations.
                    </p>
                </div>
            </Card>

            {/* Human-in-the-Loop */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary-600" />
                    Human Oversight
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Confidence Thresholds</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-success-50 rounded">
                                <span><strong>&gt;85% confidence:</strong> Auto-resolve with AI response</span>
                                <CheckCircle className="w-5 h-5 text-success-600" />
                            </div>
                            <div className="flex items-center justify-between p-2 bg-warning-50 rounded">
                                <span><strong>70-85% confidence:</strong> Suggest resolution, require human approval</span>
                                <AlertTriangle className="w-5 h-5 text-warning-600" />
                            </div>
                            <div className="flex items-center justify-between p-2 bg-danger-50 rounded">
                                <span><strong>&lt;70% confidence:</strong> Immediate escalation to human agent</span>
                                <AlertTriangle className="w-5 h-5 text-danger-600" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Always Escalated</h3>
                        <p className="text-sm text-gray-700 mb-2">These topics automatically route to human HR specialists:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Harassment, discrimination, or legal concerns</li>
                            <li>Safety, violence, or crisis situations</li>
                            <li>Complex payroll or compensation disputes</li>
                            <li>Sensitive medical or FMLA requests</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Override AI Decision</h3>
                        <p className="text-sm text-gray-700">
                            You can always request human review by clicking "Override AI Decision" on any ticket.
                            We track override rates to continuously improve our model.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Bias Monitoring */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fairness & Bias Monitoring</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Equity Check</h3>
                        <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                            <p className="text-sm text-success-900">
                                ✓ All departments receive similar resolution rates (±5% variance)
                            </p>
                            <p className="text-sm text-success-900">
                                ✓ No demographic group experiences &gt;20% worse outcomes
                            </p>
                            <p className="text-sm text-success-900">
                                ✓ Model performance consistent across all urgency levels
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Continuous Monitoring</h3>
                        <p className="text-sm text-gray-700">
                            We track resolution rates by department, category, and urgency level. If any group shows degraded performance,
                            our team investigates and corrects immediately.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Feedback & Improvement */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Continuous Improvement</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Your Feedback Matters</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            After every AI resolution, we ask "Was this helpful?" Your feedback directly improves the system:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Thumbs up → Reinforces accurate responses</li>
                            <li>Thumbs down → Triggers review and model improvement</li>
                            <li>Comments → Help us understand failure modes</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Accuracy Tracking</h3>
                        <p className="text-sm text-gray-700">
                            Our AI improved 12% over the last 30 days based on your feedback. We target &gt;90% accuracy with &lt;5% harmful error rate.
                        </p>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <strong>Current metrics:</strong> 94.2% accuracy, 2.1% harmful error rate, 4.6/5.0 satisfaction
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// Principle Item Component
const PrincipleItem = ({ title, description }) => (
    <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
        <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-700 mt-1">{description}</p>
        </div>
    </div>
);

export default Governance;
