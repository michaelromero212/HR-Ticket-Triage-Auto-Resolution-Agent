"""
PII Detection and Redaction Service
Detects and redacts sensitive personal information
"""
import re
from typing import List, Tuple

class PIIDetector:
    """Detects and redacts PII from text"""
    
    # Regex patterns for common PII
    SSN_PATTERN = r'\b\d{3}-\d{2}-\d{4}\b'
    CREDIT_CARD_PATTERN = r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
    PHONE_PATTERN = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
    EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    SALARY_PATTERN = r'\$\s?\d{1,3}(,\d{3})*(\.\d{2})?'
    
    # Medical terms (simplified list)
    MEDICAL_TERMS = [
        'diabetes', 'cancer', 'HIV', 'AIDS', 'depression', 'anxiety',
        'therapy', 'medication', 'prescription', 'diagnosis', 'treatment',
        'medical condition', 'health issue', 'doctor', 'hospital'
    ]
    
    def __init__(self):
        self.patterns = {
            'SSN': self.SSN_PATTERN,
            'CREDIT_CARD': self.CREDIT_CARD_PATTERN,
            'PHONE': self.PHONE_PATTERN,
            'EMAIL': self.EMAIL_PATTERN,  
            'SALARY': self.SALARY_PATTERN,
        }
    
    def detect_pii_types(self, text: str) -> List[str]:
        """
        Detect what types of PII are present in text
        
        Args:
            text: Input text to analyze
            
        Returns:
            List of PII types detected
        """
        detected = []
        
        # Check regex patterns
        for pii_type, pattern in self.patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                detected.append(pii_type)
        
        # Check medical terms
        text_lower = text.lower()
        for term in self.MEDICAL_TERMS:
            if term in text_lower:
                detected.append('MEDICAL_INFO')
                break
        
        return list(set(detected))  # Remove duplicates
    
    def redact(self, text: str) -> Tuple[str, List[str]]:
        """
        Redact PII from text
        
        Args:
            text: Input text to redact
            
        Returns:
            Tuple of (redacted_text, list_of_pii_types_found)
        """
        redacted_text = text
        pii_types = []
        
        # Redact SSN (show last 4 digits)
        def redact_ssn(match):
            pii_types.append('SSN')
            ssn = match.group()
            last_four = ssn[-4:]
            return f"[REDACTED-SSN-{last_four}]"
        
        redacted_text = re.sub(
            self.SSN_PATTERN,
            redact_ssn,
            redacted_text
        )
        
        # Redact credit cards (show last 4)
        def redact_cc(match):
            pii_types.append('CREDIT_CARD')
            cc = match.group().replace('-', '').replace(' ', '')
            last_four = cc[-4:]
            return f"[REDACTED-CC-{last_four}]"
        
        redacted_text = re.sub(
            self.CREDIT_CARD_PATTERN,
            redact_cc,
            redacted_text
        )
        
        # Redact phone numbers
        if re.search(self.PHONE_PATTERN, redacted_text):
            pii_types.append('PHONE')
            redacted_text = re.sub(
                self.PHONE_PATTERN,
                '[REDACTED-PHONE]',
                redacted_text
            )
        
        # Redact emails (keep domain for context)
        def redact_email(match):
            pii_types.append('EMAIL')
            email = match.group()
            domain = email.split('@')[1] if '@' in email else ''
            return f"[REDACTED-EMAIL]@{domain}" if domain else "[REDACTED-EMAIL]"
        
        redacted_text = re.sub(
            self.EMAIL_PATTERN,
            redact_email,
            redacted_text
        )
        
        # Redact salary amounts
        if re.search(self.SALARY_PATTERN, redacted_text):
            pii_types.append('SALARY')
            redacted_text = re.sub(
                self.SALARY_PATTERN,
                '[REDACTED-SALARY]',
                redacted_text
            )
        
        # Flag medical information (don't fully redact, just mark)
        text_lower = redacted_text.lower()
        for term in self.MEDICAL_TERMS:
            if term in text_lower:
                pii_types.append('MEDICAL_INFO')
                break
        
        return redacted_text, list(set(pii_types))
    
    def has_pii(self, text: str) -> bool:
        """Check if text contains any PII"""
        pii_types = self.detect_pii_types(text)
        return len(pii_types) > 0


# Example usage
if __name__ == "__main__":
    detector = PIIDetector()
    
    test_cases = [
        "My SSN is 123-45-6789 and my salary seems wrong",
        "Call me at 555-123-4567 or email john.doe@company.com",
        "I'm being treated for diabetes and need FMLA",
        "My card 1234-5678-9012-3456 was charged incorrectly",
    ]
    
    for text in test_cases:
        redacted, pii_types = detector.redact(text)
        print(f"Original: {text}")
        print(f"Redacted: {redacted}")
        print(f"PII Types: {pii_types}")
        print()
