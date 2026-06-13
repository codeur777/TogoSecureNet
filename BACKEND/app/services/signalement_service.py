"""
Service pour gérer les signalements et leur liaison avec les comptes utilisateurs
"""
from sqlalchemy.orm import Session
from typing import List, Tuple
from app.models.signalement import Signalement
from app.models.user import User


def find_signalements_by_contact(
    db: Session, 
    email: str = None, 
    phone: str = None
) -> List[Signalement]:
    """
    Recherche les signalements associés à un email ou téléphone
    
    Args:
        db: Session de base de données
        email: Email du déclarant
        phone: Téléphone du déclarant (format E164)
    
    Returns:
        Liste des signalements trouvés
    """
    query = db.query(Signalement).filter(
        Signalement.user_id == None  # Seulement les signalements non liés
    )
    
    conditions = []
    if email:
        conditions.append(Signalement.declarant_email == email)
    if phone:
        conditions.append(Signalement.declarant_phone == phone)
    
    if not conditions:
        return []
    
    from sqlalchemy import or_
    query = query.filter(or_(*conditions))
    
    return query.all()


def link_signalements_to_user(
    db: Session, 
    user_id: str, 
    signalements: List[Signalement]
) -> int:
    """
    Lie une liste de signalements à un utilisateur
    
    Args:
        db: Session de base de données
        user_id: ID de l'utilisateur
        signalements: Liste des signalements à lier
    
    Returns:
        Nombre de signalements liés
    """
    count = 0
    for signalement in signalements:
        if signalement.user_id is None:
            signalement.user_id = user_id
            count += 1
    
    if count > 0:
        db.commit()
    
    return count


def get_user_signalements(
    db: Session, 
    user_id: str,
    statut: str = None
) -> List[Signalement]:
    """
    Récupère tous les signalements d'un utilisateur
    
    Args:
        db: Session de base de données
        user_id: ID de l'utilisateur
        statut: Filtre optionnel par statut
    
    Returns:
        Liste des signalements de l'utilisateur
    """
    query = db.query(Signalement).filter(Signalement.user_id == user_id)
    
    if statut:
        from app.models.signalement import StatutSignalementEnum
        query = query.filter(Signalement.statut == StatutSignalementEnum(statut))
    
    return query.order_by(Signalement.date_declaration.desc()).all()


def count_signalements_by_contact(
    db: Session, 
    email: str = None, 
    phone: str = None
) -> int:
    """
    Compte le nombre de signalements associés à un email ou téléphone
    qui ne sont pas encore liés à un compte
    
    Args:
        db: Session de base de données
        email: Email du déclarant
        phone: Téléphone du déclarant
    
    Returns:
        Nombre de signalements trouvés
    """
    signalements = find_signalements_by_contact(db, email, phone)
    return len(signalements)
