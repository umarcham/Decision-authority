from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
try:
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    # The SDK iterator might be different, let's try basic iteration
    print("Listing models...")
    for model in client.models.list():
        if "flash" in model.name:
            print(f"FOUND: {model.name}")
except Exception as e:
    print(f"Error listing models: {e}")
