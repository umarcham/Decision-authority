
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("Attempting to initialize gemini-2.0-flash with tools...")

try:
    print("Using gemini-pro-latest with google_search_retrieval")
    tools_config = [
        {"google_search_retrieval": { "dynamic_retrieval_config": { "mode": "dynamic", "dynamic_threshold": 0.3 } }}
    ]
    model = genai.GenerativeModel('gemini-pro-latest', tools=tools_config)
    
    print("Model initialized. Generating content...")
    response = model.generate_content("What is the current exact price of iPhone 15 Pro (128GB) in India today?", stream=False)
    print("Response received:")
    print(response.text)

except Exception as e:
    print("\nFAILED:")
    print(e)
    import traceback
    traceback.print_exc()
