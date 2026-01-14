import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API service methods
export const ticketService = {
    // Submit new ticket
    submitTicket: async (ticketData) => {
        const response = await api.post('/api/tickets/submit', ticketData);
        return response.data;
    },

    // Get all tickets with filters
    getTickets: async (filters = {}) => {
        const response = await api.get('/api/tickets', { params: filters });
        return response.data;
    },

    // Get single ticket
    getTicket: async (ticketId) => {
        const response = await api.get(`/api/tickets/${ticketId}`);
        return response.data;
    },

    // Submit feedback
    submitFeedback: async (ticketId, feedback) => {
        const response = await api.post(`/api/tickets/${ticketId}/feedback`, feedback);
        return response.data;
    },

    // Override AI decision
    overrideDecision: async (ticketId) => {
        const response = await api.post(`/api/tickets/${ticketId}/override`);
        return response.data;
    },
};

export const analyticsService = {
    // Get analytics metrics
    getMetrics: async () => {
        const response = await api.get('/api/analytics/metrics');
        return response.data;
    },
};

export const knowledgeBaseService = {
    // Search knowledge base
    search: async (query) => {
        const response = await api.get('/api/knowledge-base/search', { params: { query } });
        return response.data;
    },
};

export const systemService = {
    // Health check
    getHealth: async () => {
        const response = await api.get('/api/health');
        return response.data;
    },

    // Get categories
    getCategories: async () => {
        const response = await api.get('/api/categories');
        return response.data;
    },
};

export default api;

// Convenience exports
export const getAnalytics = analyticsService.getMetrics;
