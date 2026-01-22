from logic.llm_client import generate_questions, generate_verdict
import json
import random

def run_test():
    category = "Laptop"
    print(f"--- STEP 1: Generating Questions for '{category}' ---")
    questions = generate_questions(category, "English")
    
    if not questions:
        print("FAILED: No questions generated.")
        return

    print(f"Generated {len(questions)} questions.")
    
    # Simulate user answers
    print("\n--- STEP 2: Simulating User Answers ---")
    user_values = {
        "max_price": "42000",
        "currency": "INR",
        "price_stretchable": "No",
        "hard_constraints": "None"
    }
    
    for q in questions:
        text = q['question']
        options = q['options']
        choice = random.choice(options)
        user_values[text] = choice
        print(f"Q: {text}\nA: {choice}")
        
    print("\n--- STEP 3: Generating Verdict ---")
    verdict = generate_verdict(category, user_values, "English")
    
    print("\n--- FINAL VERDICT ---")
    print(json.dumps(verdict, indent=2))

if __name__ == "__main__":
    run_test()
