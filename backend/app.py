from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import func
from flask_cors import CORS  # Import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///club_finances.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define Revenue and Expense models
class Revenue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    source = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

# Create database tables within Flask application context
with app.app_context():
    db.create_all()

# Route for adding revenue
@app.route('/revenues', methods=['POST'])
def add_revenue():
    data = request.get_json()
    new_revenue = Revenue(date=datetime.strptime(data['date'], '%Y-%m-%d'), source=data['source'], amount=data['amount'])
    db.session.add(new_revenue)
    db.session.commit()
    return jsonify({"message": "Revenue added successfully"}), 201

# Route for adding expenses
@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    new_expense = Expense(date=datetime.strptime(data['date'], '%Y-%m-%d'), category=data['category'], amount=data['amount'])
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added successfully"}), 201

# Route for getting income statement
@app.route('/income_statement', methods=['GET'])
def get_income_statement():
    total_revenue = db.session.query(func.sum(Revenue.amount)).scalar() or 0
    total_expenses = db.session.query(func.sum(Expense.amount)).scalar() or 0
    profit = total_revenue - total_expenses

    income_statement = {
        'total_revenue': total_revenue,
        'total_expenses': total_expenses,
        'profit': profit
    }

    return jsonify(income_statement)

if __name__ == '__main__':
    # Run the Flask application
    print("Current working directory:", os.getcwd())
    app.run(debug=True)
