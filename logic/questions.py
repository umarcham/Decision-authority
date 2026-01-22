questions = [
    {
        "id": "q1",
        "text": "Are you buying this phone to solve a problem or to feel something?",
        "options": [
            {
                "text": "To solve a problem (Utility)",
                "values": {"utility": 2, "status": -1},
                "next": "q2_utility"
            },
            {
                "text": "To feel something (Experience/Status)",
                "values": {"status": 2, "utility": -1},
                "next": "q2_status"
            }
        ]
    },
    {
        "id": "q2_utility",
        "text": "Will you regret a dead battery more than a blurry photo?",
        "options": [
            {
                "text": "Yes, reliability is everything.",
                "values": {"battery_life": 3, "camera": 0},
                "next": "q3_budget"
            },
            {
                "text": "No, I need to capture the moment.",
                "values": {"camera": 2, "battery_life": 1},
                "next": "q3_budget"
            }
        ]
    },
    {
        "id": "q2_status",
        "text": "Do you need the phone to be a conversation starter?",
        "options": [
            {
                "text": "Yes, I like unique design.",
                "values": {"design": 3, "ecosystem": -1},
                "next": "q3_budget"
            },
            {
                "text": "No, I just want the best.",
                "values": {"performance": 3, "status": 1},
                "next": "q3_budget"
            }
        ]
    },
    {
        "id": "q3_budget",
        "text": "How much does the price tag hurt?",
        "options": [
            {
                "text": "It doesn't. I want longevity.",
                "values": {"value": -1, "price_cap": 2000},
                "next": "q4_os"
            },
            {
                "text": "I refuse to overpay for diminishing returns.",
                "values": {"value": 3, "price_cap": 800},
                "next": "q4_os"
            },
            {
                "text": "Budget is tight. Strictly essentials.",
                "values": {"value": 5, "price_cap": 500},
                "next": "q4_os"
            }
        ]
    },
    {
        "id": "q4_os",
        "text": "Are you trapped in a walled garden?",
        "options": [
            {
                "text": "Yes, I live in iMessage.",
                "values": {"ecosystem": "apple"},
                "next": "q5_size"
            },
            {
                "text": "No, I prefer freedom.",
                "values": {"ecosystem": "android"},
                "next": "q5_size"
            },
             {
                "text": "I don't care.",
                "values": {"ecosystem": "any"},
                "next": "q5_size"
            }
        ]
    },
    {
        "id": "q5_size",
        "text": "Do you use your phone with one hand?",
        "options": [
            {
                "text": "Yes, I hate giant bricks.",
                "values": {"size_pref": "small"},
                "next": "end"
            },
            {
                "text": "No, give me the biggest screen possible.",
                "values": {"size_pref": "large"},
                "next": "end"
            }
        ]
    }
]

def get_question(question_id):
    for q in questions:
        if q["id"] == question_id:
            return q
    return None
