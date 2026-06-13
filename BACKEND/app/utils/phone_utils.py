import phonenumbers
from phonenumbers import NumberParseException


def validate_phone_number(phone: str) -> tuple[bool, str]:
    """
    Valide un numéro de téléphone international.
    
    Args:
        phone: Numéro au format international (ex: +22890123456)
        
    Returns:
        tuple[bool, str]: (is_valid, formatted_number ou message d'erreur)
    """
    if not phone:
        return False, "Numéro de téléphone requis"
    
    try:
        parsed = phonenumbers.parse(phone, None)
        if not phonenumbers.is_valid_number(parsed):
            return False, "Numéro de téléphone invalide"
        
        # Format E164 (+22890123456)
        formatted = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        return True, formatted
    
    except NumberParseException:
        return False, "Format de numéro invalide (utilisez le format international +XXX...)"


def format_phone_display(phone: str) -> str:
    """
    Formate un numéro pour affichage (format international lisible).
    
    Args:
        phone: Numéro au format E164
        
    Returns:
        str: Numéro formaté pour affichage (ex: +228 90 12 34 56)
    """
    try:
        parsed = phonenumbers.parse(phone, None)
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
    except:
        return phone
