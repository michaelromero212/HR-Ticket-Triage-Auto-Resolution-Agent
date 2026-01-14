import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { ticketService } from '../services/api';

/**
 * Ticket Queue - View all tickets with filtering
 */
const TicketQueue = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        department: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTickets();
    }, [filters]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await ticketService.getTickets(filters);
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter tickets by search query
    const filteredTickets = tickets.filter(ticket =>
        searchQuery === '' ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusOptions = ['All', 'New', 'In Progress', 'Resolved', 'Escalated'];
    const categoryOptions = [
        'All', 'Benefits Enrollment', 'PTO/Leave Requests', 'Payroll Issues',
        'IT Access Requests', 'Policy Clarifications', 'Performance Reviews',
        'Onboarding Status', 'Equipment Requests', 'Tax/W2 Documents',
        '401k/Retirement', 'Health Insurance', 'Expense Reimbursement',
        'Role/Title Changes', 'Workspace/Facilities', 'General HR Inquiries'
    ];

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

    return (
        <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
                <p className="text-gray-600">View and manage your HR ticket submissions</p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value === 'All' ? '' : e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value === 'All' ? '' : e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {categoryOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                            <select
                                value={filters.department}
                                onChange={(e) => setFilters({ ...filters, department: e.target.value === 'All' ? '' : e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option>All</option>
                                <option>Engineering</option>
                                <option>Sales</option>
                                <option>Marketing</option>
                                <option>Finance</option>
                                <option>HR</option>
                                <option>Operations</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => <Card key={i} loading />)}
                </div>
            ) : filteredTickets.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <p className="text-gray-600">No tickets found matching your criteria</p>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredTickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Individual Ticket Card Component
const TicketCard = ({ ticket }) => {
    const [expanded, setExpanded] = useState(false);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card hover onClick={() => setExpanded(!expanded)} className="cursor-pointer">
            <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">Ticket #{ticket.id}</span>
                            <Badge variant={statusToBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                            <Badge variant={urgencyToBadgeVariant(ticket.urgency)}>{ticket.urgency}</Badge>
                        </div>
                        <p className="text-gray-900 font-medium">{ticket.description.substring(0, 100)}{ticket.description.length > 100 ? '...' : ''}</p>
                    </div>
                    <button
                        className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={expanded ? 'Collapse' : 'Expand'}
                    >
                        <Eye className={`w-5 h-5 text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span>{ticket.employee_name}</span>
                    <span>•</span>
                    <span>{ticket.department}</span>
                    <span>•</span>
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span>{formatDate(ticket.created_at)}</span>
                    {ticket.auto_resolved && (
                        <>
                            <span>•</span>
                            <span className="text-success-600 font-medium">AI Resolved</span>
                        </>
                    )}
                </div>

                {/* Expanded Details */}
                {expanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Full Description:</p>
                                <p className="text-gray-900">{ticket.description}</p>
                            </div>

                            {ticket.confidence !== undefined && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">AI Confidence:</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full transition-all"
                                                style={{ width: `${ticket.confidence}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{ticket.confidence}%</span>
                                    </div>
                                </div>
                            )}

                            {ticket.resolution && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Resolution:</p>
                                    <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                                        <p className="text-sm text-gray-900">{ticket.resolution.resolution}</p>
                                    </div>
                                </div>
                            )}

                            {ticket.pii_detected && ticket.pii_detected.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-warning-700">
                                    <span className="font-medium">PII Detected:</span>
                                    <span>{ticket.pii_detected.join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TicketQueue;
