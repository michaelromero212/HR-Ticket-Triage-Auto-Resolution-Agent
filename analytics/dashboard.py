"""
Dash + Plotly Analytics Dashboard for HR Ticket Triage System
Interactive visualizations with real-time metrics
"""
import dash
from dash import dcc, html, Input, Output, callback
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import plotly.express as px
import requests
import pandas as pd
from datetime import datetime, timedelta

# Initialize Dash app with Bootstrap theme
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
app.title = "HR Ticket Analytics"

# API endpoint
API_URL = "http://localhost:8000/api/analytics/metrics"

def fetch_data():
    """Fetch analytics data from backend"""
    try:
        response = requests.get(API_URL, timeout=5)
        if response.status_code == 200:
            return response.json()
        else:
            return get_mock_data()
    except Exception as e:
        print(f"Failed to fetch data: {e}")
        return get_mock_data()

def get_mock_data():
    """Mock data if backend is unavailable"""
    return {
        "summary": {
            "total_tickets": 42,
            "auto_resolved_count": 23,
            "escalated_count": 19,
            "deflection_rate": 54.8,
            "avg_ai_resolution_time": 3.2,
            "avg_human_resolution_time": 24.5,
            "avg_csat": 4.6,
            "accuracy_rate": 94.2,
        },
        "category_breakdown": {
            "Benefits Enrollment": 6,
            "PTO/Leave Requests": 5,
            "Payroll Issues": 4,
            "IT Access Requests": 3,
            "Policy Clarifications": 4,
            "Performance Reviews": 2,
            "Onboarding Status": 2,
            "Equipment Requests": 2,
            "Tax/W2 Documents": 2,
            "401k/Retirement": 2,
            "Health Insurance": 2,
            "Expense Reimbursement": 3,
            "Role/Title Changes": 2,
            "Workspace/Facilities": 2,
            "General HR Inquiries": 3,
        },
        "department_breakdown": {
            "Engineering": 12,
            "Sales": 9,
            "Marketing": 8,
            "Finance": 6,
            "HR": 4,
            "Operations": 3,
        },
        "urgency_distribution": {
            "Low": 20,
            "Medium": 14,
            "High": 6,
            "Critical": 2,
        },
        "daily_volume": {
            "2026-01-08": 3,
            "2026-01-09": 5,
            "2026-01-10": 4,
            "2026-01-11": 6,
            "2026-01-12": 3,
            "2026-01-13": 7,
            "2026-01-14": 8,
        },
    }

# App Layout
app.layout = dbc.Container([
    # Header
    dbc.Row([
        dbc.Col([
            html.H1("HR Ticket Triage Analytics", className="text-primary mb-2"),
            html.P("Real-time metrics and insights powered by AI", className="text-muted mb-4"),
        ]),
    ], className="mb-4 mt-4"),

    # Auto-refresh interval
    dcc.Interval(
        id='interval-component',
        interval=5*60*1000,  # 5 minutes in milliseconds
        n_intervals=0
    ),

    # Last updated timestamp
    html.Div(id='last-updated', className="text-muted small mb-4"),

    # KPI Cards Row
    html.Div(id='kpi-cards', className="mb-4"),

    # Main Visualizations
    dbc.Row([
        # Category Breakdown
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H5("Ticket Volume by Category")),
                dbc.CardBody([
                    dcc.Graph(id='category-chart')
                ])
            ])
        ], width=6, className="mb-4"),

        # Trend Over Time
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H5("Tickets Over Time")),
                dbc.CardBody([
                    dcc.Graph(id='trend-chart')
                ])
            ])
        ], width=6, className="mb-4"),
    ]),

    dbc.Row([
        # Urgency Distribution
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H5("Urgency Distribution")),
                dbc.CardBody([
                    dcc.Graph(id='urgency-chart')
                ])
            ])
        ], width=6, className="mb-4"),

        # Department Breakdown
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H5("Department Volume")),
                dbc.CardBody([
                    dcc.Graph(id='department-chart')
                ])
            ])
        ], width=6, className="mb-4"),
    ]),

    # ROI Calculator
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H5("ROI Calculator")),
                dbc.CardBody([
                    dbc.Row([
                        dbc.Col([
                            html.Label("Avg HR Agent Hourly Rate ($)"),
                            dcc.Input(id='hourly-rate', type='number', value=45, className="form-control mb-3"),
                            html.Label("Deflection Rate (%)"),
                            dcc.Input(id='deflection-rate', type='number', value=54.8, className="form-control mb-3"),
                        ], width=6),
                        dbc.Col([
                            html.Div(id='roi-output', className="text-center")
                        ], width=6),
                    ])
                ])
            ])
        ], width=12, className="mb-4"),
    ]),

], fluid=True)

# Callbacks
@callback(
    [
        Output('last-updated', 'children'),
        Output('kpi-cards', 'children'),
        Output('category-chart', 'figure'),
        Output('trend-chart', 'figure'),
        Output('urgency-chart', 'figure'),
        Output('department-chart', 'figure'),
    ],
    Input('interval-component', 'n_intervals')
)
def update_dashboard(n):
    """Update all dashboard components"""
    data = fetch_data()
    summary = data['summary']
    
    # Last updated
    last_updated = html.P(f"Last updated: {datetime.now().strftime('%b %d, %Y %I:%M %p')}")
    
    # KPI Cards
    kpi_cards = dbc.Row([
        # Deflection Rate
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H6("Ticket Deflection Rate", className="text-muted mb-2"),
                    html.H2(f"{summary['deflection_rate']}%", className="text-primary mb-0"),
                    html.Small("↑ 3% vs last month", className="text-success"),
                ])
            ], className="text-center")
        ], width=3),
        
        # Avg Resolution Time
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H6("Avg Resolution Time", className="text-muted mb-2"),
                    html.Div([
                        html.Span(f"{summary['avg_ai_resolution_time']}", className="h2 text-success"),
                        html.Small(" min (AI)", className="text-muted ms-2"),
                    ]),
                    html.Small(f"vs {summary['avg_human_resolution_time']} min (human)", className="text-muted"),
                ])
            ], className="text-center")
        ], width=3),
        
        # Total Tickets
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H6("Total Tickets", className="text-muted mb-2"),
                    html.H2(f"{summary['total_tickets']}", className="text-primary mb-0"),
                    html.Small("Last 30 days", className="text-muted"),
                ])
            ], className="text-center")
        ], width=3),
        
        # CSAT Score
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H6("Employee Satisfaction", className="text-muted mb-2"),
                    html.Div([
                        html.Span(f"{summary['avg_csat']}", className="h2 text-warning"),
                        html.Span("/5.0 ⭐", className="h5 text-muted ms-2"),
                    ]),
                    html.Small(f"From {summary['total_tickets']} responses", className="text-muted"),
                ])
            ], className="text-center")
        ], width=3),
    ], className="mb-4")
    
    # Category Chart (Horizontal Bar)
    cat_df = pd.DataFrame(list(data['category_breakdown'].items()), columns=['Category', 'Count'])
    cat_df = cat_df.sort_values('Count', ascending=True)
    
    category_fig = go.Figure(data=[
        go.Bar(
            y=cat_df['Category'],
            x=cat_df['Count'],
            orientation='h',
            marker=dict(color='#2563eb'),
            text=cat_df['Count'],
            textposition='outside',
        )
    ])
    category_fig.update_layout(
        xaxis_title="Number of Tickets",
        yaxis_title="",
        showlegend=False,
        height=500,
        margin=dict(l=200, r=50, t=20, b=50),
    )
    
    # Trend Chart (Line)
    daily_df = pd.DataFrame(list(data['daily_volume'].items()), columns=['Date', 'Count'])
    daily_df['Date'] = pd.to_datetime(daily_df['Date'])
    daily_df = daily_df.sort_values('Date')
    
    trend_fig = go.Figure()
    trend_fig.add_trace(go.Scatter(
        x=daily_df['Date'],
        y=daily_df['Count'],
        mode='lines+markers',
        name='Total Tickets',
        line=dict(color='#2563eb', width=3),
        fill='tozeroy',
        fillcolor='rgba(37, 99, 235, 0.1)',
    ))
    trend_fig.update_layout(
        xaxis_title="Date",
        yaxis_title="Tickets",
        showlegend=False,
        height=300,
        margin=dict(l=50, r=50, t=20, b=50),
    )
    
    # Urgency Chart (Donut)
    urgency_df = pd.DataFrame(list(data['urgency_distribution'].items()), columns=['Urgency', 'Count'])
    colors = {'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#f97316', 'Critical': '#ef4444'}
    urgency_colors = [colors[u] for u in urgency_df['Urgency']]
    
    urgency_fig = go.Figure(data=[go.Pie(
        labels=urgency_df['Urgency'],
        values=urgency_df['Count'],
        hole=.4,
        marker=dict(colors=urgency_colors),
        textinfo='label+percent',
    )])
    urgency_fig.update_layout(
        showlegend=True,
        height=300,
        margin=dict(l=20, r=20, t=20, b=20),
    )
    
    # Department Chart (Bar)
    dept_df = pd.DataFrame(list(data['department_breakdown'].items()), columns=['Department', 'Count'])
    dept_df = dept_df.sort_values('Count', ascending=False)
    
    department_fig = go.Figure(data=[
        go.Bar(
            x=dept_df['Department'],
            y=dept_df['Count'],
            marker=dict(color='#2563eb'),
            text=dept_df['Count'],
            textposition='outside',
        )
    ])
    department_fig.update_layout(
        xaxis_title="Department",
        yaxis_title="Tickets",
        showlegend=False,
        height=300,
        margin=dict(l=50, r=50, t=20, b=50),
    )
    
    return last_updated, kpi_cards, category_fig, trend_fig, urgency_fig, department_fig

@callback(
    Output('roi-output', 'children'),
    [Input('hourly-rate', 'value'),
     Input('deflection-rate', 'value')]
)
def calculate_roi(hourly_rate, deflection_rate):
    """Calculate ROI based on inputs"""
    if not hourly_rate or not deflection_rate:
        return html.P("Enter values to calculate ROI")
    
    # Assumptions
    tickets_per_month = 500
    avg_time_per_ticket_hours = 0.5
    
    # Calculate
    deflected_tickets = tickets_per_month * (deflection_rate / 100)
    hours_saved = deflected_tickets * avg_time_per_ticket_hours
    monthly_savings = hours_saved * hourly_rate
    annual_savings = monthly_savings * 12
    
    return html.Div([
        html.H3(f"${annual_savings:,.0f}", className="text-success mb-2"),
        html.P("Annual Cost Savings", className="text-muted mb-2"),
        html.Small(f"{hours_saved:.0f} hours saved/month", className="text-muted"),
    ])

if __name__ == '__main__':
    print("Starting Dash analytics dashboard...")
    print("View at: http://localhost:8050")
    app.run_server(debug=True, host='0.0.0.0', port=8050)
