import os
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Initialize the new Client
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

def extract_first_json_object(text):
    """
    Extracts the first valid JSON object from text using a stack-based approach
    to correctly handle nested braces.
    """
    text = text.strip()
    
    # 1. Try stripping markdown code blocks first
    clean_text = re.sub(r'```json\s*|\s*```', '', text).strip()
    try:
        return json.loads(clean_text)
    except:
        pass # Continue to manual extraction if simple strip fails

    # 2. Manual Stack-Based Extraction
    stack = 0
    start_index = text.find('{')
    if start_index == -1: return None
    
    for i, char in enumerate(text[start_index:], start=start_index):
        if char == '{':
            stack += 1
        elif char == '}':
            stack -= 1
            if stack == 0:
                # Found the matching closing brace
                candidate = text[start_index : i+1]
                try:
                    return json.loads(candidate)
                except:
                    # If this fails, maybe it wasn't the right object?
                    # Continue searching? No, usually valid JSON doesn't fail.
                    pass
    
    # 3. Fallback: Try regex again on original text just in case (unlikely to help if #1 failed)
    return None

def generate_questions(product_category, language="English"):
    print(f"DEBUG: Generating questions for {product_category} in {language}")
    
    prompt = f"""
    You are a philosophical decision assistant.
    The user wants to buy a: {product_category}.
    LANGUAGE REQUIREMENT: {language}

    Generate 3 distinct philosophical questions to understand the user's underlying values for this purchase.
    Do NOT ask about specs (RAM, storage). Ask about *intent*, *longevity*, *social signaling*, or *utility*.

    OUTPUT STRICTLY A VALID JSON ARRAY.
    Example:
    [
        {{
            "question": "Do you buy for utility or status?",
            "options": ["Utility", "Status"]
        }}
    ]
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        
        text = response.text
        
        # 1. Try array extraction first
        try:
             # Basic clean first
            clean = re.sub(r'```json\s*|\s*```', '', text).strip()
            data = json.loads(clean)
        except:
             # Fallback: Assume it's a list, find [ ]
             start = text.find('[')
             end = text.rfind(']')
             if start != -1 and end != -1:
                 try:
                    data = json.loads(text[start:end+1])
                 except: data = []
             else:
                 data = []
        
        # Handle case where AI wraps array in an object {"questions": [...]}
        if isinstance(data, dict):
            for key in data:
                if isinstance(data[key], list):
                    data = data[key]
                    break
        
        if not isinstance(data, list):
            print(f"DEBUG: Data is not a list: {type(data)}")
            return [] 

        # Bulletproof Normalization
        normalized_questions = []
        for item in data:
            if not isinstance(item, dict):
                continue
            
            # Normalize 'question' key
            q_text = item.get('question') or item.get('Question') or item.get('text') or item.get('prompt')
            
            # Normalize 'options' key
            opts = item.get('options') or item.get('Options') or item.get('choices') or item.get('answers')
            
            if q_text and opts and isinstance(opts, list):
                # Sanitize options: remove nulls, ensure strings
                clean_opts = [str(o) for o in opts if o is not None and str(o).strip()]
                
                if clean_opts:
                    normalized_questions.append({
                        "question": q_text,
                        "options": clean_opts
                    })
        
        if not normalized_questions:
             print("DEBUG: No valid questions found after normalization.")
             return []
             
        return normalized_questions

    except Exception as e:
        print(f"ERROR generating questions: {e}")
        # Robust Fallback
        return [
            {
                "question": "When making this purchase, do you prioritize pure utility or long-term craftsmanship?",
                "options": ["Maximum Utility (Features/Price)", "Craftsmanship & Longevity"]
            },
            {
                "question": "Is this tool meant to isolate you for focus, or connect you for collaboration?",
                "options": ["Isolation & Deep Focus", "Connection & Collaboration"]
            },
            {
                "question": "Does this purchase represent who you are, or is it just a tool you use?",
                "options": ["It is an Extension of My Identity", "It is Just a Tool"]
            }
        ]

def generate_verdict(product_category, user_answers, language="English"):
    print(f"DEBUG: Generating verdict for {product_category} in {language}")
    
    prompt = f"""
    ROLE: You are the 'Philosopher of Commerce'.
    TASK: Decide the ONE perfect product for the user based on their philosophical answers and HARD constraints.
    LANGUAGE REQUIREMENT: {language}
    
    THE CONTRACT (Constraints):
    - Budget: {user_answers.get('max_price', 'Unlimited')} {user_answers.get('currency', 'USD')} (Stretchable: {user_answers.get('price_stretchable', 'No')})
    - Hard Constraints (MUST HAVE): {user_answers.get('hard_constraints', 'None')}
    
    IMPORTANT: 
    - Interpret the budget in {user_answers.get('currency', 'USD')}.
    - **CRITICAL**: The 'price' field in your JSON output MUST be the REAL WORLD PRICE found using Google Search.
    - **search_tool**: You have access to Google Search. You MUST use it to check the live price.
    
    USER VALUES (Philosophical Answers):
    {json.dumps(user_answers)}
    
    INSTRUCTIONS:
    0. **RESEARCH**: You have access to Google Search. You MUST use it. 
        - Search for the specific product's price in "{user_answers.get('currency', 'USD')}" using the query: "{product_category} price in {user_answers.get('currency', 'USD')} latest".
        - Verify availability in the user's implied region.
    1. FILTER: 
        - STRICTLY REJECT any product missing a Hard Constraint. 
        - REJECT products significantly above budget (unless 'Stretchable' is Yes and value is immense).
    2. SELECT:
        - Pick EXACTLY ONE winner that respects the Contract and best matches the User Values.
    
    Output strictly valid JSON:
    {{
        "name": "Product Name",
        "price": "Exact Price found in Search (e.g. ₹1,29,900)",
        "philosophical_tag": "The [Adjective] [Archetype] (e.g. The Rational Specialist)",
        "reasoning": [
            "Reason 1: Direct link to user's value...",
            "Reason 2: Why it beats the budget..."
        ],
        "rejected_alternatives": [
            {{ "name": "Runner Up 1", "reason": "Why it failed (e.g. Too expensive)" }},
            {{ "name": "Runner Up 2", "reason": "Why it failed" }}
        ],
        "closure_statement": "Final philosophical closing thought."
    }}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
                response_mime_type='application/json'
            )
        )
        
        text = response.text
        print("Raw Verdict Response:", text)
        
        # Use Helper for Robust Extraction
        raw_data = extract_first_json_object(text)
        
        if not raw_data:
             print("DEBUG: extraction failed, parsing raw text as last resort")
             # Last ditch: try parsing the whole thing (might fail with duplicate error)
             raw_data = json.loads(text)
        
        # TRANSFORMATION LAYER: Convert AI Flat JSON to Frontend Nested JSON
        transformed_result = {
            "verdict": {
                "name": raw_data.get("name", "Unknown Product"),
                "price": raw_data.get("price", "Price Unavailable"),
                "philosophical_tag": raw_data.get("philosophical_tag", "The Pragmatic Choice")
            },
            "why_this": raw_data.get("reasoning", ["Best fit for your constraints."]),
            "rejected": [],
            "closure_statement": raw_data.get("closure_statement", "Proceed with confidence.")
        }
        
        # Map rejected alternatives if they exist
        if "rejected_alternatives" in raw_data:
            transformed_result["rejected"] = raw_data["rejected_alternatives"]
            
        return transformed_result

    except Exception as e:
        print(f"CRITICAL ERROR in generate_verdict: {e}")
        # Robust Fallback - Nested Structure
        return {
            "verdict": {
                 "name": "System Recovered Recommendation",
                 "price": "Estimate Unavailable",
                 "philosophical_tag": "The Resilient Choice"
            },
            "why_this": ["The system encountered an error but recovered to give you this suggestion based on general wisdom."],
            "rejected": [],
            "closure_statement": "We apologize for the interruption. Please try again."
        }
