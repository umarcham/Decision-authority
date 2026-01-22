from flask import Flask, jsonify, request, render_template
from logic.llm_client import generate_questions, generate_verdict

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/initialize_interrogation', methods=['POST'])
def initialize():
    data = request.json
    category = data.get('category')
    if not category:
        return jsonify({"error": "No category provided"}), 400
    
    language = data.get('language', 'English')
    questions = generate_questions(category, language)
    return jsonify(questions)

@app.route('/api/decide', methods=['POST'])
def get_verdict():
    data = request.json
    category = data.get('category')
    user_answers = data.get('answers') # Dict of aggregated values
    language = data.get('language', 'English')
    
    result = generate_verdict(category, user_answers, language)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
