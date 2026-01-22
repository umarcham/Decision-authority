
from logic.llm_client import generate_questions
import json

print("Testing generate_questions for 'Gaming Laptop'...")
try:
    questions = generate_questions("Gaming Laptop", "English")
    print(f"\nType: {type(questions)}")
    print(f"Length: {len(questions)}")
    print(f"Raw Content:\n{json.dumps(questions, indent=2)}")
except Exception as e:
    print(f"CRASH: {e}")
