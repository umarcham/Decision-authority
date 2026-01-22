import json
import os

# Load data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'smartphones.json')

with open(DATA_PATH, 'r') as f:
    SMARTPHONES = json.load(f)

def calculate_score(phone, user_values):
    score = 0
    
    # 1. Price Constraint (Hard Filter logic effectively handled by scoring penalty)
    if "price_cap" in user_values:
        if phone["price"] > user_values["price_cap"]:
            return -100 # Immediate rejection candidate
            
    # 2. Ecosystem Constraint
    if "ecosystem" in user_values and user_values["ecosystem"] != "any":
        # Simplified: Apple = iOS, others = Android
        phone_os = "apple" if phone["brand"] == "Apple" else "android"
        if user_values["ecosystem"] != phone_os:
            return -100
            
    # 3. Size Preference
    if "size_pref" in user_values:
        is_large = phone["specs"]["screen_size"] > 6.2
        wants_large = user_values["size_pref"] == "large"
        if is_large != wants_large:
            score -= 5 # Penalty but not hard rejection
            
    # 4. Weighted Attributes
    # user_values e.g., {"camera": 2, "battery_life": 1, "value": 3}
    for attr, weight in user_values.items():
        if attr in phone["scores"]:
            score += phone["scores"][attr] * weight
            
    return score

def decide(user_answers_log):
    # user_answers_log is a dict merging all 'values' from selected options
    # e.g. {"utility": 2, "camera": 2, "price_cap": 800...}
    
    candidates = []
    
    for phone in SMARTPHONES:
        score = calculate_score(phone, user_answers_log)
        candidates.append({
            "phone": phone,
            "score": score
        })
        
    # Sort by score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    
    winner = candidates[0]
    
    # Generate Rejection Reasons for the runners up (top 3)
    rejected = []
    for cand in candidates[1:4]:
        if cand["score"] == -100:
            # Hard rejection
            reason = "It violated your strict requirements (Price/OS)."
        else:
            # Soft rejection - use the philosophical reason or dynamic one
            reason = cand["phone"].get("rejection_reason", "It didn't match your priorities well enough.")
            
        rejected.append({
            "name": cand["phone"]["name"],
            "reason": reason
        })
        
    return {
        "verdict": winner["phone"],
        "rejected": rejected
    }
