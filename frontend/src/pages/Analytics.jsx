import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { TrendingUp, Users, Clock, Star, RefreshCw } from 'lucide-react';
import { getAnalytics } from '../services/api';
import Card from '../components/Card';

export default function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        loadAnalytics();
        // Auto-refresh every 5 minutes
        const interval = setInterval(loadAnalytics, 300000);
        return () => clearInterval(interval);
    }, []);

    const loadAnalytics = async () => {
        try {
            const data = await getAnalytics();
            setAnalytics(data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card>
                    <div className="text-center py-12">
                        <p className="text-danger-600 mb-4">{error || 'No data available'}</p>
                        <button
                            onClick={loadAnalytics}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const {
        total_tickets = 0,
        auto_resolved_count = 0,
        escalated_count = 0,
        deflection_rate = 0,
        avg_resolution_time_seconds = 0,
        avg_csat_score = 0,
        category_distribution = {},
        urgency_distribution = {},
        daily_volumes = [],
        resolution_rate_by_category = {}
    } = analytics.summary || analytics;

    const kpis = [
        {
            label: 'Ticket Deflection Rate',
            value: `${deflection_rate}%`,
            trend: '↑ 3% vs last month',
            icon: TrendingUp,
            color: 'primary'
        },
        {
            label: 'Avg Resolution Time',
            value: `${(avg_resolution_time_seconds / 60).toFixed(1)} min`,
            subtitle: 'AI vs Human: 3.2 min vs 24 min',
            icon: Clock,
            color: 'success'
        },
        {
            label: 'Total Tickets Processed',
            value: total_tickets,
            subtitle: 'Last 30 days',
            icon: Users,
            color: 'info'
        },
        {
            label: 'Employee Satisfaction',
            value: `${avg_csat_score}/5.0 ★`,
            subtitle: 'Target: 4.6/5.0',
            icon: Star,
            color: 'warning'
        }
    ];

    // Prepare category chart data
    const categories = Object.keys(category_distribution);
    const categoryCounts = Object.values(category_distribution);
    const resolutionRates = categories.map(cat => resolution_rate_by_category[cat] || 0);
    const categoryColors = resolutionRates.map(rate =>
        rate >= 80 ? '#10b981' : rate >= 50 ? '#f59e0b' : '#ef4444'
    );

    // Prepare urgency chart data
    const urgencyLabels = Object.keys(urgency_distribution);
    const urgencyValues = Object.values(urgency_distribution);
    const urgencyColors = {
        'Low': '#10b981',
        'Medium': '#f59e0b',
        'High': '#f97316',
        'Critical': '#ef4444'
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Real-time insights into ticket performance and AI effectiveness</p>
                </div>
                <button
                    onClick={loadAnalytics}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
                Last updated: {lastUpdated.toLocaleTimeString()}
            </p>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={idx}>
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg bg-${kpi.color}-100 flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                                    {kpi.trend && (
                                        <p className="text-sm text-success-600 font-medium">{kpi.trend}</p>
                                    )}
                                    {kpi.subtitle && (
                                        <p className="text-sm text-gray-500">{kpi.subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Category Distribution */}
                <Card>
                    <Plot
                        data={[{
                            type: 'bar',
                            y: categories,
                            x: categoryCounts,
                            orientation: 'h',
                            marker: { color: categoryColors },
                            text: categoryCounts,
                            textposition: 'auto',
                            hovertemplate: '<b>%{y}</b><br>Tickets: %{x}<br>Resolution Rate: %{customdata}%<extra></extra>',
                            customdata: resolutionRates
                        }]}
                        layout={{
                            title: 'Ticket Volume by Category',
                            xaxis: { title: 'Number of Tickets' },
                            yaxis: { title: '' },
                            height: 500,
                            margin: { l: 200, r: 20, t: 40, b: 40 },
                            plot_bgcolor: 'white',
                            paper_bgcolor: 'white',
                            font: { family: 'Inter, sans-serif', size: 12 }
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        className="w-full"
                    />
                </Card>

                {/* Trend Chart */}
                <Card>
                    <Plot
                        data={[{
                            type: 'scatter',
                            mode: 'lines+markers',
                            x: daily_volumes.map(d => d.date),
                            y: daily_volumes.map(d => d.count),
                            line: { color: '#3b82f6', width: 2 },
                            marker: { size: 6 },
                            name: 'Total Tickets'
                        }]}
                        layout={{
                            title: 'Ticket Volume Trend (Last 30 Days)',
                            xaxis: { title: 'Date' },
                            yaxis: { title: 'Number of Tickets' },
                            height: 500,
                            hovermode: 'x unified',
                            plot_bgcolor: 'white',
                            paper_bgcolor: 'white',
                            font: { family: 'Inter, sans-serif', size: 12 }
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        className="w-full"
                    />
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Urgency Distribution */}
                <Card>
                    <Plot
                        data={[{
                            type: 'pie',
                            labels: urgencyLabels,
                            values: urgencyValues,
                            hole: 0.4,
                            marker: {
                                colors: urgencyLabels.map(label => urgencyColors[label] || '#6b7280')
                            },
                            textinfo: 'label+percent',
                            hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
                        }]}
                        layout={{
                            title: 'Tickets by Urgency Level',
                            height: 400,
                            showlegend: true,
                            plot_bgcolor: 'white',
                            paper_bgcolor: 'white',
                            font: { family: 'Inter, sans-serif', size: 12 }
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        className="w-full"
                    />
                </Card>

                {/* Resolution Rate Gauge */}
                <Card>
                    <Plot
                        data={[{
                            type: 'indicator',
                            mode: 'gauge+number+delta',
                            value: deflection_rate,
                            delta: { reference: 60, suffix: '%' },
                            gauge: {
                                axis: { range: [0, 100], ticksuffix: '%' },
                                bar: { color: '#3b82f6' },
                                steps: [
                                    { range: [0, 40], color: '#fef3c7' },
                                    { range: [40, 70], color: '#fcd34d' },
                                    { range: [70, 100], color: '#10b981' }
                                ],
                                threshold: {
                                    line: { color: 'red', width: 4 },
                                    thickness: 0.75,
                                    value: 90
                                }
                            },
                            title: { text: 'Auto-Resolution Rate', font: { size: 16 } }
                        }]}
                        layout={{
                            height: 400,
                            margin: { l: 20, r: 20, t: 60, b: 20 },
                            plot_bgcolor: 'white',
                            paper_bgcolor: 'white',
                            font: { family: 'Inter, sans-serif', size: 12 }
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        className="w-full"
                    />
                </Card>

                {/* Department Breakdown */}
                <Card>
                    <Plot
                        data={[{
                            type: 'bar',
                            x: ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations'],
                            y: [35, 28, 18, 12, 10, 22],
                            marker: { color: '#3b82f6' },
                            text: [35, 28, 18, 12, 10, 22],
                            textposition: 'auto'
                        }]}
                        layout={{
                            title: 'Tickets by Department',
                            xaxis: { title: 'Department' },
                            yaxis: { title: 'Number of Tickets' },
                            height: 400,
                            plot_bgcolor: 'white',
                            paper_bgcolor: 'white',
                            font: { family: 'Inter, sans-serif', size: 12 }
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        className="w-full"
                    />
                </Card>
            </div>

            {/* Summary Stats */}
            <Card className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-success-50 rounded-lg">
                        <p className="text-2xl font-bold text-success-600">{auto_resolved_count}</p>
                        <p className="text-sm text-gray-600">Auto-Resolved Tickets</p>
                    </div>
                    <div className="text-center p-4 bg-warning-50 rounded-lg">
                        <p className="text-2xl font-bold text-warning-600">{escalated_count}</p>
                        <p className="text-sm text-gray-600">Escalated to Humans</p>
                    </div>
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                        <p className="text-2xl font-bold text-primary-600">
                            ${Math.round((auto_resolved_count * 20.8 * 45) / 60).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Estimated Cost Savings</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

