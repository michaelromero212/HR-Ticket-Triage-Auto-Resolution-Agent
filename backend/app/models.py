"""
Data models for HR Ticket Triage system.
Includes Pydantic models for API validation and SQLAlchemy models for database persistence.
"""

from datetime import datetime
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field, validator
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

# ============================================================================
# Enums
# ============================================================================

class TicketCategory(str, Enum):
    """15 HR ticket categories"""
    PTO_REQUEST = "PTO Request"
    BENEFITS_ENROLLMENT = "Benefits Enrollment"
    PAYROLL_ISSUE = "Payroll Issue"
    WORKDAY_ACCESS = "Workday Access"
    WFH_REQUEST = "Work From Home Request"
    EXPENSE_REIMBURSEMENT = "Expense Reimbursement"
    ONBOARDING = "Onboarding"
    OFFBOARDING = "Offboarding"
    PERFORMANCE_REVIEW = "Performance Review"
    TRAINING_REQUEST = "Training Request"
    IT_EQUIPMENT = "IT Equipment"
    POLICY_QUESTION = "Policy Question"
    HEALTHCARE = "Healthcare"
    RETIREMENT_401K = "Retirement/401k"
    OTHER = "Other"


class UrgencyLevel(str, Enum):
    """Ticket urgency levels"""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class TicketStatus(str, Enum):
    """Ticket status lifecycle"""
    NEW = "New"
    IN_PROGRESS = "In Progress"
    AUTO_RESOLVED = "Auto-Resolved"
    ESCALATED = "Escalated"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


# ============================================================================
# Pydantic Models (API Validation)
# ============================================================================

class TicketSubmission(BaseModel):
    """Request model for ticket submission"""
    description: str = Field(..., min_length=10, max_length=2000)
    employee_name: str = Field(..., min_length=1, max_length=100)
    employee_id: Optional[str] = Field(None, max_length=50)
    department: str = Field(..., min_length=1, max_length=100)
    
    @validator('description')
    def validate_description(cls, v):
        if not v or v.strip() == '':
            raise ValueError('Description cannot be empty')
        return v.strip()


class Classification(BaseModel):
    """AI classification result"""
    category: TicketCategory
    confidence: float = Field(..., ge=0.0, le=1.0)
    urgency: UrgencyLevel
    reasoning: str
    detected_pii: List[str] = []
    escalation_recommended: bool


class Resolution(BaseModel):
    """Auto-resolution response"""
    success: bool
    resolution_text: str
    sources: List[str] = []
    confidence: float = Field(..., ge=0.0, le=1.0)
    resolution_time_seconds: float


class Feedback(BaseModel):
    """User feedback on ticket resolution"""
    ticket_id: int
    helpful: bool
    csat_score: Optional[int] = Field(None, ge=1, le=5)
    comments: Optional[str] = Field(None, max_length=500)


class TicketOverride(BaseModel):
    """Override AI decision"""
    ticket_id: int
    new_category: Optional[TicketCategory] = None
    escalate: bool
    reason: str = Field(..., min_length=10, max_length=500)


class TicketResponse(BaseModel):
    """Full ticket response"""
    id: int
    description: str
    description_redacted: str
    employee_name: str
    department: str
    category: TicketCategory
    confidence: float
    urgency: UrgencyLevel
    status: TicketStatus
    classification_reasoning: str
    auto_resolution: Optional[str] = None
    resolution_sources: List[str] = []
    resolution_time_seconds: Optional[float] = None
    escalated: bool
    feedback_helpful: Optional[bool] = None
    csat_score: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AnalyticsMetrics(BaseModel):
    """Analytics dashboard metrics"""
    total_tickets: int
    auto_resolved_count: int
    escalated_count: int
    deflection_rate: float
    avg_resolution_time_seconds: float
    avg_csat_score: float
    category_distribution: dict
    urgency_distribution: dict
    daily_volumes: List[dict]
    resolution_rate_by_category: dict


# ============================================================================
# SQLAlchemy Models (Database)
# ============================================================================

class TicketDB(Base):
    """Database model for tickets"""
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Ticket content
    description = Column(Text, nullable=False)
    description_redacted = Column(Text, nullable=False)
    employee_name = Column(String(100), nullable=False)
    employee_id = Column(String(50), nullable=True)
    department = Column(String(100), nullable=False)
    
    # AI classification
    category = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    urgency = Column(String(20), nullable=False)
    classification_reasoning = Column(Text, nullable=True)
    detected_pii = Column(Text, nullable=True)  # JSON string
    
    # Resolution
    status = Column(String(20), nullable=False, default=TicketStatus.NEW.value)
    auto_resolution = Column(Text, nullable=True)
    resolution_sources = Column(Text, nullable=True)  # JSON string
    resolution_time_seconds = Column(Float, nullable=True)
    escalated = Column(Boolean, default=False)
    escalation_reason = Column(Text, nullable=True)
    
    # Feedback
    feedback_helpful = Column(Boolean, nullable=True)
    csat_score = Column(Integer, nullable=True)
    feedback_comments = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)


class AuditLogDB(Base):
    """Audit trail for data access and AI decisions"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, nullable=True)
    action = Column(String(50), nullable=False)  # "ticket_created", "ai_classified", "override", etc.
    actor = Column(String(100), nullable=True)  # User or "system"
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)


# ============================================================================
# Database Setup
# ============================================================================

def get_database_url():
    """Get database URL (SQLite for this implementation)"""
    return "sqlite:///./hr_tickets.db"


def init_db():
    """Initialize database tables"""
    engine = create_engine(
        get_database_url(),
        connect_args={"check_same_thread": False}  # SQLite specific
    )
    Base.metadata.create_all(bind=engine)
    return engine


def get_session():
    """Get database session"""
    engine = create_engine(
        get_database_url(),
        connect_args={"check_same_thread": False}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()
