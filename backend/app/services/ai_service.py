"""
AI Service for ticket classification and auto-resolution
Uses HuggingFace Inference API for classification
"""
import os
import json
from typing import Dict, List, Tuple, Optional
from huggingface_hub import InferenceClient

# Configure HuggingFace
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN", "")

class AIService:
    """AI-powered ticket classification and resolution"""
    
    # 15 HR categories
    CATEGORIES = [
        "Benefits Enrollment",
        "PTO/Leave Requests",
        "Payroll Issues",
        "IT Access Requests",
        "Policy Clarifications",
        "Performance Reviews",
        "Onboarding Status",
        "Equipment Requests",
        "Tax/W2 Documents",
        "401k/Retirement",
        "Health Insurance",
        "Expense Reimbursement",
        "Role/Title Changes",
        "Workspace/Facilities",
        "General HR Inquiries",
    ]
    
    # Keywords that trigger immediate escalation
    SENSITIVE_KEYWORDS = [
        'harassment', 'discrimination', 'lawsuit', 'lawyer', 'sue',
        'unsafe', 'assault', 'threat', 'suicide', 'violence'
    ]
    
    def __init__(self, knowledge_base_path: str = None):
        """Initialize AI service with knowledge base"""
        self.knowledge_base_path = knowledge_base_path or "app/knowledge_base"
        self.knowledge_base = self._load_knowledge_base()
        
        # Configure HuggingFace Inference API (if token available)
        if HUGGINGFACE_TOKEN:
            try:
                # Use the new HuggingFace router endpoint
                self.client = InferenceClient(
                    token=HUGGINGFACE_TOKEN,
                    base_url="https://router.huggingface.co"
                )
                # Test with a simple call
                test_response = self.client.text_generation(
                    "Test", 
                    model="microsoft/Phi-3-mini-4k-instruct",
                    max_new_tokens=10
                )
                self.use_ai = True
                print("✓ HuggingFace AI enabled with Phi-3 model")
            except Exception as e:
                print(f"Failed to initialize HuggingFace: {e}")
                self.use_ai = False
        else:
            self.use_ai = False
            print("No HuggingFace token, using mock responses")
    
    
    def _load_knowledge_base(self) -> Dict[str, str]:
        """Load knowledge base documents"""
        kb = {}
        kb_files = [
            "pto_policy.md",
            "benefits_guide.md",
            "workday_howto.md",
            "wfh_policy.md",
            "expense_policy.md",
        ]
        
        for filename in kb_files:
            try:
                filepath = os.path.join(self.knowledge_base_path, filename)
                with open(filepath, 'r') as f:
                    kb[filename] = f.read()
            except FileNotFoundError:
                print(f"Warning: {filename} not found")
        
        return kb
    
    def classify_ticket(self, description: str) -> Dict:
        """
        Classify ticket into category with confidence score
        
        Args:
            description: Ticket description text
            
        Returns:
            Dict with category, confidence, urgency, reasoning
        """
        # Check for sensitive content first
        description_lower = description.lower()
        if any(keyword in description_lower for keyword in self.SENSITIVE_KEYWORDS):
            return {
                "category": "General HR Inquiries",
                "confidence": 0,
                "urgency": "Critical",
                "reasoning": "Flagged as sensitive content requiring immediate human review",
                "sensitive": True,
            }
        
        # Use AI if available, otherwise use keyword matching
        if self.use_ai:
            return self._classify_with_ai(description)
        else:
            return self._classify_with_keywords(description)
    
    def _classify_with_ai(self, description: str) -> Dict:
        """Classify using HuggingFace AI"""
        prompt = f"""You are an HR ticket classification system. Classify the following employee inquiry into ONE of these categories:

{', '.join(self.CATEGORIES)}

Employee inquiry: "{description}"

Respond with JSON only:
{{
  "category": "category name",
  "confidence": confidence score 0-100,
  "urgency": "Low/Medium/High/Critical",
  "reasoning": "brief explanation"
}}"""
        
        try:
            print(f"🤖 Calling HuggingFace AI for classification...")
            # Use Microsoft Phi-3 (smaller, faster, works well for classification)
            response = self.client.text_generation(
                prompt,
                model="microsoft/Phi-3-mini-4k-instruct",
                max_new_tokens=200,
                temperature=0.2,
            )
            
            print(f"✓ Got response from HuggingFace: {response[:100]}...")
            
            # Extract JSON from response
            response_text = response.strip()
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            result = json.loads(response_text.strip())
            print(f"✓ AI Classification: {result['category']} ({result['confidence']}%)")
            return result
        except Exception as e:
            print(f"❌ AI classification failed: {e}")
            print(f"Falling back to keyword matching...")
            return self._classify_with_keywords(description)
    
    def _classify_with_keywords(self, description: str) -> Dict:
        """Fallback keyword-based classification"""
        description_lower = description.lower()
        
        # Simple keyword matching
        keyword_map = {
            "Benefits Enrollment": ["401k", "health insurance", "benefits", "enrollment", "open enrollment"],
            "PTO/Leave Requests": ["pto", "vacation", "sick leave", "time off", "leave"],
            "Payroll Issues": ["paycheck", "salary", "overtime", "pay", "direct deposit", "withholding"],
            "IT Access Requests": ["access", "password", "vpn", "salesforce", "permissions"],
            "Policy Clarifications": ["policy", "wfh", "work from home", "remote work", "dress code"],
            "Performance Reviews": ["performance", "review", "goals", "feedback"],
            "Onboarding Status": ["onboarding", "new hire", "orientation", "start date"],
            "Equipment Requests": ["laptop", "monitor", "equipment", "headset", "keyboard"],
            "Tax/W2 Documents": ["w-2", "w2", "tax", "withholding", "1099"],
            "401k/Retirement": ["401k", "retirement", "investment", "vesting"],
            "Health Insurance": ["health insurance", "medical", "deductible", "claim", "ppo", "hmo"],
            "Expense Reimbursement": ["expense", "reimbursement", "receipt", "per diem"],
            "Role/Title Changes": ["promotion", "title", "role change"],
            "Workspace/Facilities": ["conference room", "parking", "facilities", "ac", "desk"],
            "General HR Inquiries": ["workday", "address", "emergency contact", "hr"],
        }
        
        # Find best match
        best_category = "General HR Inquiries"
        best_score = 0
        
        for category, keywords in keyword_map.items():
            score = sum(1 for kw in keywords if kw in description_lower)
            if score > best_score:
                best_score = score
                best_category = category
        
        # Determine confidence and urgency
        confidence = min(50 + (best_score * 20), 95)
        
        urgency = "Low"
        if any(word in description_lower for word in ["urgent", "asap", "emergency", "critical"]):
            urgency = "High"
        elif any(word in description_lower for word in ["soon", "need", "help"]):
            urgency = "Medium"
        
        return {
            "category": best_category,
            "confidence": confidence,
            "urgency": urgency,
            "reasoning": f"Matched keywords: {', '.join([kw for kw in keyword_map[best_category] if kw in description_lower])}",
            "sensitive": False,
        }
    
    def auto_resolve(self, description: str, category: str) -> Optional[Dict]:
        """
        Attempt to auto-resolve ticket using RAG
        
        Args:
            description: Ticket description
            category: Classified category
            
        Returns:
            Dict with resolution, sources, confidence or None if can't resolve
        """
        # Map categories to knowledge base files
        kb_mapping = {
            "PTO/Leave Requests": "pto_policy.md",
            "Benefits Enrollment": "benefits_guide.md",
            "401k/Retirement": "benefits_guide.md",
            "Health Insurance": "benefits_guide.md",
            "Policy Clarifications": "wfh_policy.md",
            "General HR Inquiries": "workday_howto.md",
            "Tax/W2 Documents": "workday_howto.md",
            "Expense Reimbursement": "expense_policy.md",
        }
        
        kb_file = kb_mapping.get(category)
        if not kb_file or kb_file not in self.knowledge_base:
            return None
        
        # Simple keyword-based extraction (in production, use embeddings + semantic search)
        kb_content = self.knowledge_base[kb_file]
        
        # Mock resolution for common queries
        return self._generate_mock_resolution(description, category, kb_file)
    
    def _generate_mock_resolution(self, description: str, category: str, source: str) -> Dict:
        """Generate mock resolution with citation"""
        description_lower = description.lower()
        
        # Common resolutions
        if "401k" in description_lower and "match" in description_lower:
            return {
                "resolution": "Our company offers a 50% match on the first 6% of your salary contributed to the 401(k).\n\nExample: If you earn $100,000 and contribute 6% ($6,000), the company adds $3,000.\n\nAll contributions are immediately 100% vested.",
                "sources": [{"file": source, "section": "401(k) Plan"}],
                "confidence": 96,
                "steps": None,
            }
        
        if "pto" in description_lower or "request" in description_lower:
            return {
                "resolution": "To request PTO:\n\n1. Log in to Workday\n2. Navigate to Time Off > Request Time Off\n3. Select date range and PTO type (vacation or sick)\n4. Submit request\n\nVacation requests require 2 weeks advance notice. Your manager will approve within 3 business days.",
                "sources": [{"file": source, "section": "Request Process"}],
                "confidence": 98,
                "steps": [
                    "Log in to Workday",
                    "Navigate to Time Off > Request Time Off",
                    "Select dates and type",
                    "Submit for manager approval"
                ],
            }
        
        if "open enrollment" in description_lower:
            return {
                "resolution": "Open Enrollment runs annually from November 1-15.\n\nDuring this period, you can:\n- Change medical, dental, vision plans\n- Update beneficiaries\n- Adjust FSA contributions\n\nChanges become effective January 1. Visit Workday > Benefits > Benefits Enrollment to make changes.",
                "sources": [{"file": source, "section": "Open Enrollment"}],
                "confidence": 99,
                "steps": None,
            }
        
        if "address" in description_lower and "workday" in description_lower:
            return {
                "resolution": "To update your address in Workday:\n\n1. Navigate to Personal Information\n2. Click the Contact tab\n3. Find 'Home Address' section\n4. Click Edit (pencil icon)\n5. Enter new address\n6. Click Submit\n\nHR will approve within 1 business day. This affects tax withholding and benefits, so update before year-end.",
                "sources": [{"file": source, "section": "Updating Personal Information"}],
                "confidence": 94,
                "steps": [
                    "Navigate to Personal Information",
                    "Click Contact tab",
                    "Edit Home Address",
                    "Submit for approval"
                ],
            }
        
        # Generic response
        return {
            "resolution": f"Based on our {source.replace('.md', '').replace('_', ' ').title()}, please refer to the relevant section for detailed information.",
            "sources": [{"file": source, "section": "Overview"}],
            "confidence": 75,
            "steps": None,
        }


# Example usage
if __name__ == "__main__":
    service = AIService()
    
    test_queries = [
        "How do I request PTO for next week?",
        "What's our 401k match?",
        "I'm experiencing harassment from my manager",
        "My paycheck is missing overtime",
    ]
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        classification = service.classify_ticket(query)
        print(f"Category: {classification['category']}")
        print(f"Confidence: {classification['confidence']}%")
        print(f"Urgency: {classification['urgency']}")
        
        if classification['confidence'] > 85 and not classification.get('sensitive'):
            resolution = service.auto_resolve(query, classification['category'])
            if resolution:
                print(f"Auto-resolved: {resolution['resolution'][:100]}...")
