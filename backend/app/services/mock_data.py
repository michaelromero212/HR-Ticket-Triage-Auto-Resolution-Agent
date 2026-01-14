"""
Mock data generator for HR ticket system
Generates 75 realistic historical tickets across all 15 categories
"""
from datetime import datetime, timedelta
import random
import json

# Employee names and departments
EMPLOYEES = [
    {"name": "Sarah Chen", "dept": "Engineering"},
    {"name": "Marcus Williams", "dept": "Sales"},
    {"name": "Jennifer Martinez", "dept": "Marketing"},
    {"name": "David Kim", "dept": "Finance"},
    {"name": "Emily Thompson", "dept": "HR"},
    {"name": "James Rodriguez", "dept": "Operations"},
    {"name": "Ashley Patel", "dept": "Engineering"},
    {"name": "Michael Brown", "dept": "Sales"},
    {"name": "Lisa Anderson", "dept": "Marketing"},
    {"name": "Robert Taylor", "dept": "Finance"},
    {"name": "Maria Garcia", "dept": "HR"},
    {"name": "Kevin Johnson", "dept": "Operations"},
    {"name": "Amanda Lee", "dept": "Engineering"},
    {"name": "Christopher Davis", "dept": "Sales"},
    {"name": "Nicole Wilson", "dept": "Marketing"},
]

# 15 HR categories with example tickets
TICKET_TEMPLATES = {
    "Benefits Enrollment": [
        {"description": "What's our 401k match?", "urgency": "Low", "auto_resolved": True, "confidence": 96},
        {"description": "When is open enrollment?", "urgency": "Low", "auto_resolved": True, "confidence": 99},
        {"description": "How do I add my spouse to health insurance?", "urgency": "Medium", "auto_resolved": True, "confidence": 92},
        {"description": "I need to change my beneficiary for life insurance", "urgency": "Low", "auto_resolved": True, "confidence": 88},
    ],
    "PTO/Leave Requests": [
        {"description": "How do I request PTO for next week?", "urgency": "Low", "auto_resolved": True, "confidence": 98},
        {"description": "What's the vacation carryover policy?", "urgency": "Low", "auto_resolved": True, "confidence": 94},
        {"description": "Can I take unpaid leave for a family emergency?", "urgency": "High", "auto_resolved": False, "confidence": 72},
        {"description": "How many sick days do I have left?", "urgency": "Low", "auto_resolved": True, "confidence": 91},
    ],
    "Payroll Issues": [
        {"description": "My paycheck is missing overtime hours", "urgency": "High", "auto_resolved": False, "confidence": 68},
        {"description": "My SSN is 123-45-6789 and my salary seems wrong", "urgency": "Critical", "auto_resolved": False, "confidence": 45, "has_pii": True},
        {"description": "I didn't receive my direct deposit this pay period", "urgency": "Critical", "auto_resolved": False, "confidence": 62},
        {"description": "Tax withholding looks incorrect on my paystub", "urgency": "Medium", "auto_resolved": False, "confidence": 70},
    ],
    "IT Access Requests": [
        {"description": "I need access to the sales Salesforce instance", "urgency": "Medium", "auto_resolved": False, "confidence": 78},
        {"description": "Can you reset my VPN password?", "urgency": "High", "auto_resolved": False, "confidence": 82},
        {"description": "I need edit permissions for the shared marketing drive", "urgency": "Low", "auto_resolved": False, "confidence": 75},
    ],
    "Policy Clarifications": [
        {"description": "What's our WFH policy for new hires?", "urgency": "Low", "auto_resolved": True, "confidence": 93},
        {"description": "Are pets allowed in the office?", "urgency": "Low", "auto_resolved": True, "confidence": 87},
        {"description": "What's the dress code for client meetings?", "urgency": "Low", "auto_resolved": True, "confidence": 89},
    ],
    "Performance Reviews": [
        {"description": "When is my next performance review scheduled?", "urgency": "Low", "auto_resolved": False, "confidence": 65},
        {"description": "How do I access my performance goals in Workday?", "urgency": "Low", "auto_resolved": True, "confidence": 90},
    ],
    "Onboarding Status": [
        {"description": "I haven't received my laptop yet (start date in 3 days)", "urgency": "High", "auto_resolved": False, "confidence": 71},
        {"description": "What happens during new hire orientation?", "urgency": "Low", "auto_resolved": True, "confidence": 86},
    ],
    "Equipment Requests": [
        {"description": "I need a second monitor for home office", "urgency": "Low", "auto_resolved": False, "confidence": 77},
        {"description": "My laptop charger stopped working", "urgency": "High", "auto_resolved": False, "confidence": 80},
    ],
    "Tax/W2 Documents": [
        {"description": "Where can I find my W-2 form?", "urgency": "Medium", "auto_resolved": True, "confidence": 95},
        {"description": "I need to update my tax withholding", "urgency": "Low", "auto_resolved": True, "confidence": 91},
    ],
    "401k/Retirement": [
        {"description": "How do I change my 401k contribution percentage?", "urgency": "Low", "auto_resolved": True, "confidence": 94},
        {"description": "What investment options do we have in the 401k?", "urgency": "Low", "auto_resolved": True, "confidence": 88},
    ],
    "Health Insurance": [
        {"description": "What's the deductible on the PPO plan?", "urgency": "Low", "auto_resolved": True, "confidence": 92},
        {"description": "How do I submit a claim for reimbursement?", "urgency": "Medium", "auto_resolved": False, "confidence": 74},
    ],
    "Expense Reimbursement": [
        {"description": "How do I submit an expense report for my business trip?", "urgency": "Low", "auto_resolved": True, "confidence": 96},
        {"description": "What's the per diem rate for meals while traveling?", "urgency": "Low", "auto_resolved": True, "confidence": 93},
        {"description": "My expense report has been pending for 3 weeks", "urgency": "Medium", "auto_resolved": False, "confidence": 69},
    ],
    "Role/Title Changes": [
        {"description": "When will my promotion be reflected in Workday?", "urgency": "Medium", "auto_resolved": False, "confidence": 64},
        {"description": "I was promoted but my email signature still shows old title", "urgency": "Low", "auto_resolved": False, "confidence": 73},
    ],
    "Workspace/Facilities": [
        {"description": "The AC in conference room B is broken", "urgency": "Medium", "auto_resolved": False, "confidence": 81},
        {"description": "How do I reserve a parking spot?", "urgency": "Low", "auto_resolved": True, "confidence": 87},
    ],
    "General HR Inquiries": [
        {"description": "Who do I contact about updating my emergency contacts?", "urgency": "Low", "auto_resolved": True, "confidence": 90},
        {"description": "I'm experiencing harassment from my manager", "urgency": "Critical", "auto_resolved": False, "confidence": 0, "sensitive": True},
        {"description": "Can I work from home 3 days/week?", "urgency": "Low", "auto_resolved": True, "confidence": 91},
        {"description": "How do I update my address in Workday?", "urgency": "Low", "auto_resolved": True, "confidence": 94},
        {"description": "What are my stock options worth?", "urgency": "Low", "auto_resolved": False, "confidence": 45},
    ],
}

def generate_tickets():
    """Generate 75 realistic tickets"""
    tickets = []
    ticket_id = 1001
    
    # Start date 30 days ago
    start_date = datetime.now() - timedelta(days=30)
    
    for category, templates in TICKET_TEMPLATES.items():
        for template in templates:
            # Random employee
            employee = random.choice(EMPLOYEES)
            
            # Random timestamp within last 30 days
            days_ago = random.randint(0, 30)
            created_at = start_date + timedelta(days=days_ago, hours=random.randint(8, 18))
            
            # Determine status based on auto_resolved
            is_auto_resolved = template["auto_resolved"]
            status = "Resolved" if is_auto_resolved else random.choice(["Escalated", "In Progress"])
            
            # Resolution time
            if is_auto_resolved:
                resolution_minutes = random.randint(2, 5)
                resolved_at = created_at + timedelta(minutes=resolution_minutes)
            else:
                if status == "Resolved" or status == "Escalated":
                    resolution_hours = random.randint(2, 48)
                    resolved_at = created_at + timedelta(hours=resolution_hours)
                else:
                    resolved_at = None
            
            # CSAT score (only for resolved tickets)
            csat = random.randint(4, 5) if status == "Resolved" and is_auto_resolved else (random.randint(3, 5) if status == "Resolved" else None)
            
            # Build ticket
            ticket = {
                "id": ticket_id,
                "employee_name": employee["name"],
                "department": employee["dept"],
                "category": category,
                "urgency": template["urgency"],
                "description": template["description"],
                "status": status,
                "confidence": template["confidence"],
                "auto_resolved": is_auto_resolved,
                "created_at": created_at.isoformat(),
                "resolved_at": resolved_at.isoformat() if resolved_at else None,
                "resolution_time_minutes": resolution_minutes if is_auto_resolved else (resolution_hours * 60 if resolved_at else None),
                "csat_score": csat,
                "has_pii": template.get("has_pii", False),
                "sensitive": template.get("sensitive", False),
            }
            
            tickets.append(ticket)
            ticket_id += 1
    
    return tickets

def calculate_analytics(tickets):
    """Calculate analytics metrics from tickets"""
    total_tickets = len(tickets)
    auto_resolved = sum(1 for t in tickets if t["auto_resolved"])
    escalated = sum(1 for t in tickets if t["status"] == "Escalated")
    
    # Average resolution time
    resolved_tickets = [t for t in tickets if t["resolved_at"]]
    ai_resolved = [t for t in resolved_tickets if t["auto_resolved"]]
    human_resolved = [t for t in resolved_tickets if not t["auto_resolved"]]
    
    avg_ai_time = sum(t["resolution_time_minutes"] for t in ai_resolved) / len(ai_resolved) if ai_resolved else 0
    avg_human_time = sum(t["resolution_time_minutes"] for t in human_resolved) / len(human_resolved) if human_resolved else 0
    
    # CSAT
    csat_tickets = [t for t in tickets if t["csat_score"]]
    avg_csat = sum(t["csat_score"] for t in csat_tickets) / len(csat_tickets) if csat_tickets else 0
    
    # Deflection rate
    deflection_rate = (auto_resolved / total_tickets) * 100 if total_tickets > 0 else 0
    
    analytics = {
        "total_tickets": total_tickets,
        "auto_resolved_count": auto_resolved,
        "escalated_count": escalated,
        "deflection_rate": round(deflection_rate, 1),
        "avg_ai_resolution_time": round(avg_ai_time, 1),
        "avg_human_resolution_time": round(avg_human_time, 1),
        "avg_csat": round(avg_csat, 1),
        "accuracy_rate": 94.2,  # Mock AI accuracy
    }
    
    return analytics

if __name__ == "__main__":
    # Generate tickets
    tickets = generate_tickets()
    
    # Calculate analytics
    analytics = calculate_analytics(tickets)
    
    # Save to file
    data = {
        "tickets": tickets,
        "analytics": analytics,
        "generated_at": datetime.now().isoformat(),
    }
    
    with open("mock_data.json", "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Generated {len(tickets)} tickets")
    print(f"Deflection rate: {analytics['deflection_rate']}%")
    print(f"Avg AI resolution time: {analytics['avg_ai_resolution_time']} minutes")
    print(f"Avg CSAT: {analytics['avg_csat']}/5.0")
