import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink } from 'lucide-react';
import Card from '../components/Card';
import { knowledgeBaseService } from '../services/api';

/**
 * Knowledge Base - Search and browse HR policies
 */
const KnowledgeBase = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const documents = [
        {
            title: 'PTO Policy',
            description: '15 days vacation, 10 sick days, request process, carryover rules',
            file: 'pto_policy.md',
            icon: '🌴',
        },
        {
            title: 'Benefits Guide',
            description: 'Health insurance, 401k, open enrollment, coverage options',
            file: 'benefits_guide.md',
            icon: '💼',
        },
        {
            title: 'Workday How-To',
            description: 'Password reset, update info, view pay stubs, request time off',
            file: 'workday_howto.md',
            icon: '💻',
        },
        {
            title: 'Work From Home Policy',
            description: 'Hybrid schedule, eligibility, equipment, home office stipend',
            file: 'wfh_policy.md',
            icon: '🏠',
        },
        {
            title: 'Expense Reimbursement',
            description: 'Eligible expenses, submission process, limits, timelines',
            file: 'expense_policy.md',
            icon: '💳',
        },
    ];

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const results = await knowledgeBaseService.search(query);
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
                <p className="text-gray-600">
                    Search our HR policies and guides for answers to common questions
                </p>
            </div>

            {/* Search */}
            <Card className="mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search knowledge base... (e.g., 'vacation days', '401k match', 'remote work')"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                    />
                </div>

                {/* Search Results */}
                {searchQuery.length >= 3 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        {searching ? (
                            <p className="text-gray-600 text-center py-4">Searching...</p>
                        ) : searchResults.length > 0 ? (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                </p>
                                <div className="space-y-3">
                                    {searchResults.map((result, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                            <p className="font-medium text-gray-900 mb-1">{result.title}</p>
                                            {result.snippets.map((snippet, sidx) => (
                                                <p key={sidx} className="text-sm text-gray-700">• {snippet}</p>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-4">
                                No results found. Try different keywords.
                            </p>
                        )}
                    </div>
                )}
            </Card>

            {/* Browse Documents */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse All Policies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc, idx) => (
                        <Card key={idx} hover>
                            <div className="text-center">
                                <div className="text-5xl mb-4">{doc.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                                <button className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                                    <BookOpen className="w-4 h-4" />
                                    Read Policy
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <FAQItem
                        question="How many vacation days do I get?"
                        answer="Full-time employees receive 15 days of vacation and 10 days of sick leave per calendar year, pro-rated based on start date."
                    />
                    <FAQItem
                        question="What's our 401k match?"
                        answer="The company matches 50% of your contributions up to the first 6% of your salary. All contributions are immediately 100% vested."
                    />
                    <FAQItem
                        question="Can I work from home?"
                        answer="Most roles qualify for a hybrid schedule: 3 days in office, 2 days remote. Submit a request in Workday under 'Request Flexible Work Arrangement'."
                    />
                    <FAQItem
                        question="When is open enrollment?"
                        answer="Open enrollment runs annually from November 1-15. You can change medical, dental, vision plans and update beneficiaries during this period."
                    />
                </div>
            </div>
        </div>
    );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card hover onClick={() => setExpanded(!expanded)} className="cursor-pointer">
            <div>
                <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 pr-8">{question}</h3>
                    <span className="text-gray-400 text-xl flex-shrink-0">{expanded ? '−' : '+'}</span>
                </div>
                {expanded && (
                    <p className="mt-3 text-gray-700">{answer}</p>
                )}
            </div>
        </Card>
    );
};

export default KnowledgeBase;
