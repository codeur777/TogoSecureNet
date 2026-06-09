"""
Service de génération de portrait-robot avec l'API Google Gemini
"""
import google.generativeai as genai
from app.core.config import settings
import base64
from io import BytesIO
from PIL import Image
import requests

# Configurer l'API Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_portrait_prompt(description: dict) -> str:
    """
    Convertit la description structurée en prompt pour l'IA
    """
    prompt = "Generate a highly realistic facial portrait photograph of a person with the following characteristics:\n\n"
    
    # Informations générales
    if description.get("age"):
        prompt += f"- Age: approximately {description['age']} years old\n"
    if description.get("gender"):
        gender_map = {"M": "male", "F": "female"}
        prompt += f"- Gender: {gender_map.get(description['gender'], description['gender'])}\n"
    if description.get("ethnicity"):
        prompt += f"- Ethnicity: {description['ethnicity']}\n"
    
    # Visage
    if description.get("face_shape"):
        prompt += f"- Face shape: {description['face_shape']}\n"
    if description.get("skin_tone"):
        prompt += f"- Skin tone: {description['skin_tone']}\n"
    
    # Cheveux
    if description.get("hair_color"):
        prompt += f"- Hair color: {description['hair_color']}\n"
    if description.get("hair_style"):
        prompt += f"- Hair style: {description['hair_style']}\n"
    if description.get("hair_length"):
        prompt += f"- Hair length: {description['hair_length']}\n"
    
    # Yeux
    if description.get("eye_color"):
        prompt += f"- Eye color: {description['eye_color']}\n"
    if description.get("eye_shape"):
        prompt += f"- Eye shape: {description['eye_shape']}\n"
    
    # Nez et bouche
    if description.get("nose_shape"):
        prompt += f"- Nose: {description['nose_shape']}\n"
    if description.get("mouth_shape"):
        prompt += f"- Mouth: {description['mouth_shape']}\n"
    
    # Caractéristiques distinctives
    if description.get("facial_hair"):
        prompt += f"- Facial hair: {description['facial_hair']}\n"
    if description.get("distinctive_features"):
        prompt += f"- Distinctive features: {description['distinctive_features']}\n"
    
    # Description supplémentaire
    if description.get("additional_description"):
        prompt += f"\nAdditional details: {description['additional_description']}\n"
    
    prompt += "\nStyle: Professional police sketch, front-facing portrait, neutral expression, plain background, high detail, photorealistic."
    
    return prompt

async def generate_portrait_with_gemini(description: dict) -> dict:
    """
    Génère un portrait-robot en utilisant l'API Gemini
    """
    try:
        # Créer le prompt
        prompt = generate_portrait_prompt(description)
        
        # Utiliser Imagen via Gemini (si disponible) ou alternative
        # Note: Gemini peut ne pas avoir de génération d'image directe
        # On utilise une alternative comme DALL-E ou Stable Diffusion
        
        # Pour l'instant, retourner un placeholder avec le prompt
        return {
            "success": True,
            "prompt": prompt,
            "image_url": None,
            "message": "Portrait prompt généré. Intégration avec service de génération d'images requise.",
            "provider": "gemini"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Erreur lors de la génération du portrait"
        }

def refine_portrait_with_feedback(original_prompt: str, feedback: str) -> str:
    """
    Affine le prompt avec les retours de l'utilisateur
    """
    refined_prompt = f"{original_prompt}\n\nModifications requested: {feedback}\n\n"
    refined_prompt += "Apply these modifications while maintaining the overall style and quality."
    
    return refined_prompt

async def generate_portrait_with_stability_ai(prompt: str, api_key: str = None) -> dict:
    """
    Alternative: Génération avec Stability AI (Stable Diffusion)
    """
    try:
        if not api_key:
            return {
                "success": False,
                "error": "API key manquante",
                "message": "Clé API Stability AI non configurée"
            }
        
        url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "text_prompts": [
                {
                    "text": prompt,
                    "weight": 1
                }
            ],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
        }
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            image_b64 = data["artifacts"][0]["base64"]
            
            return {
                "success": True,
                "image_base64": image_b64,
                "prompt": prompt,
                "provider": "stability_ai"
            }
        else:
            return {
                "success": False,
                "error": response.text,
                "message": "Erreur lors de la génération avec Stability AI"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Erreur lors de la génération du portrait"
        }

async def generate_portrait_simple(description: dict) -> dict:
    """
    Version simplifiée pour démo - génère un placeholder
    """
    prompt = generate_portrait_prompt(description)
    
    # Pour la démo, on retourne juste le prompt
    # En production, intégrer avec une vraie API de génération d'images
    return {
        "success": True,
        "prompt": prompt,
        "image_url": f"https://api.dicebear.com/7.x/human/svg?seed={description.get('name', 'portrait')}",
        "message": "Portrait généré (version démo)",
        "provider": "demo"
    }
