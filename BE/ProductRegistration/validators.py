import re
from rest_framework import serializers


SERIAL_NUMBER_PATTERN = r"^[0-9]{4}[0-9]{2}(AMP|API)[0-9]{6}B$"

def validate_serial_pattern(value):
    if not value:
        raise serializers.ValidationError("Serial number cannot be empty.")
    
    # Strip whitespace
    cleaned_value = value.strip()
    
    # Compile pattern for validation
    pattern = re.compile(SERIAL_NUMBER_PATTERN)
    
    if not pattern.fullmatch(cleaned_value):
        raise serializers.ValidationError(
            "Serial number must follow pattern: YYYYMM{AMP|API}XXXXXXB (e.g., 202505AMP123456B)"
        )
    
    return cleaned_value