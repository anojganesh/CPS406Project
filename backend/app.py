from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import func
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///club_finances.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#member classes

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    credit_card_info = db.Column(db.String(100))  # Placeholder for encryption/tokenization methods

class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    schedule = db.Column(db.String(100), nullable=False)

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.String(100), db.ForeignKey('member.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    paid = db.Column(db.Boolean, default=False)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    payment_type = db.Column(db.String(50))

#admin classes

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

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    date = db.Column(db.Date, default=datetime.now)

with app.app_context():
    db.create_all()


@app.route('/attendance', methods=['POST'])
def record_attendance():
    data = request.get_json()
    attendance = Attendance(member_id=data['member_id'], paid=True)
    db.session.add(attendance)
    new_revenue = Revenue(date=datetime.strptime(data['date'], '%Y-%m-%d'), source='Member class pay - {}'.format(data['member_id']), amount=50)
    db.session.add(new_revenue)
    db.session.commit()
    return jsonify({'message': 'Attendance recorded'}), 201

@app.route('/api/attendance_records', methods=['GET'])
def get_attendance_records():
    try:
        # Fetch all attendance records from the database
        records = Attendance.query.all()
        records_data = [{'memberId': record.member_id, 'date': record.date.strftime('%Y-%m-%d')} for record in records]
        return jsonify(records_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/classes', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    return jsonify([{'id': c.id, 'title': c.title, 'schedule': c.schedule} for c in classes])

@app.route('/revenues', methods=['POST'])
def add_revenue():
    data = request.get_json()
    new_revenue = Revenue(date=datetime.strptime(data['date'], '%Y-%m-%d'), source=data['source'], amount=data['amount'])
    db.session.add(new_revenue)
    db.session.commit()
    return jsonify({"message": "Revenue added successfully"}), 201

@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    new_expense = Expense(date=datetime.strptime(data['date'], '%Y-%m-%d'), category=data['category'], amount=data['amount'])
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added successfully"}), 201

@app.route('/api/revenues', methods=['GET'])
def get_revenues():
    revenues = Revenue.query.all()
    return jsonify([{'id': r.id, 'date': r.date.strftime('%Y-%m-%d'), 'source': r.source, 'amount': r.amount} for r in revenues])

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([{'id': e.id, 'date': e.date.strftime('%Y-%m-%d'), 'category': e.category, 'amount': e.amount} for e in expenses])

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

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.get_json()
    new_message = Message(user_name=data['user_name'], message=data['message'], date=datetime.utcnow())  # Ensure the date is updated correctly
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Message sent successfully"}), 201

@app.route('/api/messages/', methods=['GET'])
def get_all_messages():
    messages = Message.query.all()
    return jsonify([{'id': m.id, 'user_name': m.user_name, 'message': m.message, 'date': m.date.strftime('%Y-%m-%d %H:%M:%S')} for m in messages])


if __name__ == '__main__':
    print("Current working directory:", os.getcwd())
    app.run(debug=True)