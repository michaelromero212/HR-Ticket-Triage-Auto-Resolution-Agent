"""
FastAPI Backend for HR Ticket Triage System
Handles ticket submission, AI classification, PII detection, and analytics
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import json
import os

from app.services.ai_service import AIService
from app.services.pii_detector import PIIDetector

app = FastAPI(
    title="HR Ticket Triage API",
    description="AI-powered HR ticket classification and auto-resolution",
    version="2.3.1"
)

# CORS configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ai_service = AIService()
pii_detector = PIIDetector()

# Load mock data
with open("app/services/mock_data.json", "r") as f:
    mock_data = json.load(f)
    TICKETS = mock_data["tickets"]
    ANALYTICS = mock_data["analytics"]

# Pydantic Models
class TicketSubmission(BaseModel):
    employee_name: str = Field(..., min_length=2, max_length=100)
    department: str
    description: str = Field(..., min_length=10, max_length=500)
    
    @validator('description')
    def description_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Description cannot be empty')
        return v

class TicketResponse(BaseModel):
    id: int
    employee_name: str
    department: str
    category: str
    urgency: str
    description: str
    description_redacted: str
    status: str
    confidence: float
    auto_resolved: bool
    created_at: str
    resolved_at: Optional[str]
    resolution: Optional[dict]
    pii_detected: List[str]
    sensitive: bool

class FeedbackSubmission(BaseModel):
    ticket_id: int
    helpful: bool
    comment: Optional[str] = None

# API Endpoints

@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "operational",
        "version": "2.3.1",
        "ai_status": "connected" if ai_service.use_ai else "mock_mode",
    }

@app.get("/api/health")
async def health():
    """System health check"""
    return {
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "operational",
            "ai": "connected" if ai_service.use_ai else "mock",
            "pii_detector": "operational",
        }
    }

@app.post("/api/tickets/submit", response_model=TicketResponse)
async def submit_ticket(submission: TicketSubmission):
    """
    Submit a new HR ticket
    - Detects PII and redacts
    - Classifies with AI
    - Attempts auto-resolution
    - Escalates if needed
    """
    # Detect and redact PII
    redacted_description, pii_types = pii_detector.redact(submission.description)
    
    # Classify ticket
    classification = ai_service.classify_ticket(submission.description)
    
    # Check if sensitive
    is_sensitive = classification.get("sensitive", False)
    
    # Attempt auto-resolution if confidence is high enough
    resolution = None
    auto_resolved = False
    
    if classification["confidence"] >= 85 and not is_sensitive:
        resolution = ai_service.auto_resolve(
            submission.description, 
            classification["category"]
        )
        if resolution:
            auto_resolved = True
    
    # Determine status
    if is_sensitive:
        ticket_status = "Escalated"
    elif auto_resolved:
        ticket_status = "Resolved"
    elif classification["confidence"] < 70:
        ticket_status = "Escalated"
    else:
        ticket_status = "In Progress"
    
    # Create ticket
    ticket = {
        "id": len(TICKETS) + 1,
        "employee_name": submission.employee_name,
        "department": submission.department,
        "category": classification["category"],
        "urgency": classification["urgency"],
        "description": submission.description,
        "description_redacted": redacted_description,
        "status": ticket_status,
        "confidence": classification["confidence"],
        "auto_resolved": auto_resolved,
        "created_at": datetime.now().isoformat(),
        "resolved_at": datetime.now().isoformat() if auto_resolved else None,
        "resolution": resolution,
        "pii_detected": pii_types,
        "sensitive": is_sensitive,
        "reasoning": classification.get("reasoning", ""),
    }
    
    # Add to mock database
    TICKETS.append(ticket)
    
    return ticket

@app.get("/api/tickets")
async def get_tickets(
    status: Optional[str] = None,
    category: Optional[str] = None,
    department: Optional[str] = None,
    limit: int = 50
):
    """Get tickets with optional filtering"""
    filtered_tickets = TICKETS
    
    if status:
        filtered_tickets = [t for t in filtered_tickets if t["status"] == status]
    
    if category:
        filtered_tickets = [t for t in filtered_tickets if t["category"] == category]
    
    if department:
        filtered_tickets = [t for t in filtered_tickets if t["department"] == department]
    
    # Sort by created_at descending
    sorted_tickets = sorted(
        filtered_tickets, 
        key=lambda x: x["created_at"], 
        reverse=True
    )
    
    return sorted_tickets[:limit]

@app.get("/api/tickets/{ticket_id}")
async def get_ticket(ticket_id: int):
    """Get specific ticket by ID"""
    ticket = next((t for t in TICKETS if t["id"] == ticket_id), None)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return ticket

@app.post("/api/tickets/{ticket_id}/feedback")
async def submit_feedback(ticket_id: int, feedback: FeedbackSubmission):
    """Submit feedback on AI resolution"""
    ticket = next((t for t in TICKETS if t["id"] == ticket_id), None)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Store feedback (in production, save to database)
    ticket["feedback"] = {
        "helpful": feedback.helpful,
        "comment": feedback.comment,
        "submitted_at": datetime.now().isoformat()
    }
    
    return {"status": "success", "message": "Feedback recorded"}

@app.post("/api/tickets/{ticket_id}/override")
async def override_decision(ticket_id: int):
    """Override AI decision and escalate to human"""
    ticket = next((t for t in TICKETS if t["id"] == ticket_id), None)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket["status"] = "Escalated"
    ticket["override"] = True
    ticket["overridden_at"] = datetime.now().isoformat()
    
    return {"status": "success", "message": "Ticket escalated to human agent"}

@app.get("/api/analytics/metrics")
async def get_analytics():
    """Get analytics data for dashboard"""
    # Category breakdown
    category_counts = {}
    for ticket in TICKETS:
        cat = ticket["category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1
    
    # Department breakdown
    dept_counts = {}
    for ticket in TICKETS:
        dept = ticket["department"]
        dept_counts[dept] = dept_counts.get(dept, 0) + 1
    
    # Urgency distribution
    urgency_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    for ticket in TICKETS:
        urgency_counts[ticket["urgency"]] = urgency_counts.get(ticket["urgency"], 0) + 1
    
    # Daily ticket volume (last 30 days)
    from collections import defaultdict
    daily_tickets = defaultdict(int)
    for ticket in TICKETS:
        date = ticket["created_at"].split("T")[0]
        daily_tickets[date] += 1
    
    return {
        "summary": ANALYTICS,
        "category_breakdown": category_counts,
        "department_breakdown": dept_counts,
        "urgency_distribution": urgency_counts,
        "daily_volume": dict(daily_tickets),
        "total_tickets": len(TICKETS),
    }

@app.get("/api/knowledge-base/search")
async def search_knowledge_base(query: str):
    """Search knowledge base documents"""
    # Simple search across all KB documents
    results = []
    
    for filename, content in ai_service.knowledge_base.items():
        if query.lower() in content.lower():
            # Extract relevant snippet
            lines = content.split('\n')
            relevant_lines = [line for line in lines if query.lower() in line.lower()]
            
            results.append({
                "file": filename,
                "title": filename.replace('.md', '').replace('_', ' ').title(),
                "snippets": relevant_lines[:3],  # First 3 matches
            })
    
    return results

@app.get("/api/categories")
async def get_categories():
    """Get list of all ticket categories"""
    return AIService.CATEGORIES

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle unexpected errors"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred",
            "error": str(exc) if os.getenv("DEBUG") else "Internal server error"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
