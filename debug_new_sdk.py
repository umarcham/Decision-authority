
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(api_key=api_key)

print("Attempting to search with google-genai SDK...")

try:
    # Proper formatting for new SDK tools
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents='What is the exact price of iPhone 16 Pro in India right now?',
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())]
        )
    )
    
    print("Response received:")
    print(response.text)
    
    # Check if grounding metadata exists
    if response.candidates[0].grounding_metadata:
        print("\nGrounding Metadata Found (Search was used!)")
        print(response.candidates[0].grounding_metadata.search_entry_point.rendered_content)

except Exception as e:
    print("\nFAILED:")
    print(e)
    import traceback
    traceback.print_exc()
