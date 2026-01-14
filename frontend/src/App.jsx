import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    FileText,
    LayoutDashboard,
    BookOpen,
    Settings,
    HelpCircle,
    Menu,
    X,
    Search,
    Bell,
    User,
    Lock
} from 'lucide-react';

// Import pages (we'll create these)
import TicketSubmission from './pages/TicketSubmission';
import TicketQueue from './pages/TicketQueue';
import Analytics from './pages/Analytics';
import KnowledgeBase from './pages/KnowledgeBase';
import Governance from './pages/Governance';
import Privacy from './pages/Privacy';
import HelpCenter from './pages/HelpCenter';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* Skip to main content link for accessibility */}
                <a href="#main-content" className="skip-link">
                    Skip to main content
                </a>

                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Layout */}
                <div className="flex">
                    {/* Sidebar */}
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                    {/* Main Content */}
                    <main
                        id="main-content"
                        className="flex-1 p-4 md:p-8 md:ml-64 transition-all duration-200"
                        role="main"
                    >
                        <Routes>
                            <Route path="/" element={<TicketSubmission />} />
                            <Route path="/tickets" element={<TicketQueue />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/knowledge-base" element={<KnowledgeBase />} />
                            <Route path="/governance" element={<Governance />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/help" element={<HelpCenter />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

// Header Component
function Header({ onMenuClick }) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 py-3 md:pl-64">
                {/* Left: Mobile menu + Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                            HR Ticket Triage System
                        </h1>
                    </div>
                </div>

                {/* Center: Search (desktop) */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search tickets..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-100 relative"
                        aria-label="View notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                    </button>

                    <button
                        className="p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Help"
                    >
                        <HelpCircle className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                    </div>
                </div>
            </div>
        </header>
    );
}

// Sidebar Component
function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const navigation = [
        { name: 'Submit Ticket', path: '/', icon: FileText, primary: true },
        { name: 'My Tickets', path: '/tickets', icon: LayoutDashboard },
        { name: 'Analytics Dashboard', path: '/analytics', icon: LayoutDashboard },
        { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
        { name: 'AI Governance', path: '/governance', icon: Lock },
        { name: 'Data Privacy', path: '/privacy', icon: Lock },
        { name: 'Help & Support', path: '/help', icon: HelpCircle },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-200 pt-16
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Close button (mobile) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:hidden p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Close menu"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Navigation links */}
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                  ${item.primary ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-600">
                        <p className="font-medium">AI Agent v2.3.1</p>
                        <p>Last updated: Jan 14, 2026</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                            <span>All systems operational</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default App;
