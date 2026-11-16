from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit-lead', methods=['POST'])
def submit_lead():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    interest = data.get('interest', 'General Consultation')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open('leads.txt', 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] Name: {name} | Email: {email} | Phone: {phone} | Palette: {interest}\n")
        
    return jsonify({"status": "success", "message": "Lead saved!"})

if __name__ == '__main__':
    app.run(debug=True)