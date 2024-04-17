from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_migrate import Migrate
from sqlalchemy import func
from flask_cors import CORS, cross_origin
from datetime import datetime
import os
import uuid 

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

CORS(app, resources={"/*": {"origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:5000"]}})

CORS(app, methods=["GET", "POST"], headers=["Content-Type"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///club_finances.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route('/api', methods=['GET'])
@cross_origin()
def index():
    return {
        "server": "Flask React Heroku"
    }
#member classes

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    isAdmin = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    schedule = db.Column(db.String(100), nullable=False)

class Attendance(db.Model):
    fullname = db.Column(db.String(100), nullable=False)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime, default=datetime.now)


class Payment(db.Model):    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fullname = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    latefee = db.Column(db.Integer)

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
    user_id = db.Column(db.Integer, nullable=False)
    message = db.Column(db.String(500), nullable=False)
    date = db.Column(db.Date, default=datetime.now)


with app.app_context():
    db.create_all()

    fake_expenses = [
        {"Date": datetime(2022, 1, 8, 9, 7, 9), "source": "Hall Rent", "amount": 100},
        {"Date": datetime(2023, 2, 7, 7, 1, 7), "source": "Hall Rent", "amount": 100},
        {"Date": datetime(2023, 3, 6, 2, 4, 6), "source": "Hall Rent", "amount": 100},
        {"Date": datetime(2024, 4, 5, 2, 6, 4), "source": "Hall Rent", "amount": 100}
    ]

    

    fake_members = [
    {"id": 9, "fullname": "John Doe", "username": "johndoe", "password": "password1", "isAdmin": True},
    {"id": 10, "fullname": "Jane Smith", "username": "jane", "password": "jane", "isAdmin": False},
    {"id": 11, "fullname": "Alice Johnson", "username": "alicejohnson", "password": "password3", "isAdmin": False},
    {"id": 12, "fullname": "Bob Brown", "username": "bob36", "password": "bob123", "isAdmin": False},
    {"id": 13, "fullname": "Eve Williams", "username": "a", "password": "a", "isAdmin": False}
    ]

    fake_attendances = [
        {"fullname": "John Doe", "dates": [
            datetime(2022, 1, 1, 14, 20, 0),
            datetime(2022, 2, 1, 8, 45, 0),
            datetime(2022, 3, 1, 11, 5, 0),
            datetime(2022, 4, 1, 16, 30, 0),
            datetime(2022, 5, 1, 10, 15, 0),
            datetime(2022, 6, 1, 13, 50, 0),
            datetime(2022, 7, 1, 15, 0, 0),
            datetime(2022, 8, 1, 9, 30, 0),
            datetime(2022, 9, 1, 12, 45, 0),
            datetime(2022, 10, 1, 14, 10, 0),
            datetime(2022, 11, 1, 11, 55, 0),
            datetime(2022, 12, 1, 10, 0, 0),
            datetime(2023, 1, 1, 16, 20, 0),
            datetime(2023, 2, 1, 8, 40, 0),
            datetime(2023, 3, 1, 11, 15, 0),
            datetime(2023, 4, 1, 15, 35, 0),
            datetime(2023, 5, 1, 10, 5, 0),
            datetime(2023, 6, 1, 13, 45, 0),
            datetime(2023, 7, 1, 15, 10, 0),
            datetime(2023, 8, 1, 9, 20, 0),
            datetime(2023, 9, 1, 12, 50, 0),
            datetime(2023, 10, 1, 14, 25, 0),
            datetime(2023, 11, 1, 11, 30, 0),
            datetime(2023, 12, 1, 10, 15, 0),
            datetime(2024, 1, 1, 16, 30, 0),
            datetime(2024, 2, 1, 8, 55, 0),
            datetime(2024, 3, 1, 11, 40, 0),
            datetime(2024, 4, 1, 15, 0, 0)
        ]},
        {"fullname": "Jane Smith", "dates": [
            datetime(2022, 1, 1, 13, 10, 0),
            datetime(2022, 3, 1, 10, 25, 0),
            datetime(2022, 5, 1, 12, 15, 0),
            datetime(2022, 7, 1, 14, 30, 0),
            datetime(2022, 9, 1, 11, 45, 0),
            datetime(2022, 11, 1, 10, 5, 0),
            datetime(2023, 1, 1, 15, 55, 0),
            datetime(2023, 3, 1, 9, 35, 0),
            datetime(2023, 5, 1, 11, 20, 0),
            datetime(2023, 7, 1, 13, 40, 0),
            datetime(2023, 9, 1, 11, 0, 0),
            datetime(2023, 11, 1, 9, 15, 0),
            datetime(2024, 1, 1, 16, 10, 0),
            datetime(2024, 3, 1, 10, 30, 0)
        ]},
        {"fullname": "Alice Johnson", "dates": [
            datetime(2022, 1, 1, 14, 50, 0),
            datetime(2022, 4, 1, 8, 30, 0),
            datetime(2022, 7, 1, 11, 45, 0),
            datetime(2022, 10, 1, 15, 20, 0),
            datetime(2023, 1, 1, 10, 10, 0),
            datetime(2023, 4, 1, 13, 35, 0),
            datetime(2023, 7, 1, 15, 45, 0),
            datetime(2023, 10, 1, 9, 40, 0),
            datetime(2024, 1, 1, 12, 20, 0),
            datetime(2024, 4, 1, 8, 0, 0)
        ]},
        {"fullname": "Bob Brown", "dates": [
            datetime(2022, 1, 1, 16, 15, 0),
            datetime(2022, 5, 1, 9, 50, 0),
            datetime(2022, 9, 1, 11, 30, 0),
            datetime(2023, 1, 1, 13, 20, 0),
            datetime(2023, 5, 1, 9, 40, 0),
            datetime(2023, 9, 1, 11, 55, 0),
            datetime(2024, 1, 1, 15, 45, 0)
        ]},
        {"fullname": "Eve Williams", "dates": [
            datetime(2022, 1, 1, 13, 30, 0),
            datetime(2022, 6, 1, 10, 45, 0),
            datetime(2022, 11, 1, 12, 25, 0),
            datetime(2023, 4, 1, 14, 50, 0),
            datetime(2023, 9, 1, 10, 15, 0),
            datetime(2024, 2, 1, 8, 30, 0)
        ]}
    ]

    
    

    fake_payments = [
        {"fullname": "John Doe", "dates": [
            datetime(2022, 1, 1, 14, 20, 0),
            datetime(2022, 2, 1, 8, 45, 0),
            datetime(2022, 3, 1, 11, 5, 0),
            datetime(2022, 4, 1, 16, 30, 0),
            datetime(2022, 5, 1, 10, 15, 0),
            datetime(2022, 6, 1, 13, 50, 0),
            datetime(2022, 7, 1, 15, 0, 0),
            datetime(2022, 8, 1, 9, 30, 0),
            datetime(2022, 9, 1, 12, 45, 0),
            datetime(2022, 10, 1, 14, 10, 0),
            datetime(2022, 11, 1, 11, 55, 0),
            datetime(2022, 12, 1, 10, 0, 0),
            datetime(2023, 1, 1, 16, 20, 0),
            datetime(2023, 2, 1, 8, 40, 0),
            datetime(2023, 3, 1, 11, 15, 0),
            datetime(2023, 4, 1, 15, 35, 0),
            datetime(2023, 5, 1, 10, 5, 0),
            datetime(2023, 6, 1, 13, 45, 0),
            datetime(2023, 7, 1, 15, 10, 0),
            datetime(2023, 8, 1, 9, 20, 0),
            datetime(2023, 9, 1, 12, 50, 0),
            datetime(2023, 10, 1, 14, 25, 0),
            datetime(2023, 11, 1, 11, 30, 0),
            datetime(2023, 12, 1, 10, 15, 0),
            datetime(2024, 1, 1, 16, 30, 0),
            datetime(2024, 2, 1, 8, 55, 0),
            datetime(2024, 3, 1, 11, 40, 0),
            datetime(2024, 4, 1, 15, 0, 0)
        ], "payments": [10] * 28, "latefee": 0},
        {"fullname": "Jane Smith", "dates": [
            datetime(2022, 1, 1, 13, 10, 0),
            datetime(2022, 3, 1, 10, 25, 0),
            datetime(2022, 5, 1, 12, 15, 0),
            datetime(2022, 7, 1, 14, 30, 0),
            datetime(2022, 9, 1, 11, 45, 0),
            datetime(2022, 11, 1, 10, 5, 0),
            datetime(2023, 1, 1, 15, 55, 0),
            datetime(2023, 3, 1, 9, 35, 0),
            datetime(2023, 5, 1, 11, 20, 0),
            datetime(2023, 7, 1, 13, 40, 0),
            datetime(2023, 9, 1, 11, 0, 0),
            datetime(2023, 11, 1, 9, 15, 0),
            datetime(2024, 1, 1, 16, 10, 0),
            datetime(2024, 3, 1, 10, 30, 0)
        ], "payments": [40, 50, 0, 0, 10, 10, 10, 0, 10, 0, 10, 10, 0, 10], "latefee": 20*3},
        {"fullname": "Alice Johnson", "dates": [
            datetime(2022, 1, 1, 14, 50, 0),
            datetime(2022, 4, 1, 8, 30, 0),
            datetime(2022, 7, 1, 11, 45, 0),
            datetime(2022, 10, 1, 15, 20, 0),
            datetime(2023, 1, 1, 10, 10, 0),
            datetime(2023, 4, 1, 13, 35, 0),
            datetime(2023, 7, 1, 15, 45, 0),
            datetime(2023, 10, 1, 9, 40, 0),
            datetime(2024, 1, 1, 12, 20, 0),
            datetime(2024, 4, 1, 8, 0, 0)
        ], "payments": [10, 0, 40, 0, 10, 0, 10, 0, 10, 0], "latefee": 20*2},
        {"fullname": "Bob Brown", "dates": [
            datetime(2022, 1, 1, 16, 15, 0),
            datetime(2022, 5, 1, 9, 50, 0),
            datetime(2022, 9, 1, 11, 30, 0),
            datetime(2023, 1, 1, 13, 20, 0),
            datetime(2023, 5, 1, 9, 40, 0),
            datetime(2023, 9, 1, 11, 55, 0),
            datetime(2024, 1, 1, 15, 45, 0)
        ], "payments": [10, 0, 0, 10, 0, 0, 10], "latefee": 20*4},
        {"fullname": "Eve Williams", "dates": [
            datetime(2022, 1, 1, 13, 30, 0),
            datetime(2022, 6, 1, 10, 45, 0),
            datetime(2022, 11, 1, 12, 25, 0),
            datetime(2023, 4, 1, 14, 50, 0),
            datetime(2023, 9, 1, 10, 15, 0),
            datetime(2024, 2, 1, 8, 30, 0)
        ], "payments": [0, 10, 0, 0, 10, 10], "latefee": 20*3}
    ]

    def add_member(id, fullname, username, password, isAdmin):
        member = Member(username=username, isAdmin=isAdmin, name=fullname, password=password)
        db.session.add(member)
        db.session.commit()
    
    def add_attendance(fullname, date):
        attendance = Attendance(fullname=fullname, date=date)
        db.session.add(attendance)
        db.session.commit()
    
    def add_payment(fullname, amount, date, latefee):
        payment = Payment(fullname=fullname, amount=amount, date=date, latefee=latefee)
        db.session.add(payment)
        db.session.commit()
    
    @app.route('/getallpayments', methods=['GET'])
    def get_all_payments():
        payments = Payment.query.all()
        payment_data = [
            {"fullname": payment.fullname, "amount": payment.amount, "date": payment.date.strftime('%Y-%m-%d'), "latefee": payment.latefee}
            for payment in payments
        ]
        return jsonify(payment_data)

    def add_expenses(date, source, amount):
        expense = Expense(date=date, category=source, amount=amount)
        db.session.add(expense)
        db.session.commit()

    
    #add fake everything
    if not Member.query.filter_by(username='johndoe').first():
        for fake_member in fake_members:
            add_member(fake_member["id"], fake_member["fullname"], fake_member["username"], fake_member["password"], fake_member["isAdmin"])

        for fake_attendance in fake_attendances:
            name = fake_attendance["fullname"]
            for date in fake_attendance["dates"]:
                add_attendance(name, date)

        for fake_payment in fake_payments:
            name = fake_payment["fullname"]
            for i in range(0, len(fake_payment["dates"])):
                add_payment(name, fake_payment["payments"][i], fake_payment["dates"][i], fake_payment["latefee"])
    
        for fake_expense in fake_expenses:
            date = fake_expense["Date"]
            source = fake_expense["source"]
            amount = fake_expense["amount"]
            add_expenses(date, source, amount)

@app.route('/getexpenses', methods=['GET'])
def getexpenses():
    expenses = Expense.query.all()
    returndata = [{'date': expense.date, 'source': expense.category, 'amount': expense.amount} for expense in expenses]
    return jsonify(returndata)

@app.route('/getrevenue', methods=['GET'])
def getrevenue():
    revenues = Revenue.query.all()  
    returndata = [{'date': revenue.date.strftime('%Y-%m-%d'), 'source': revenue.source, 'amount': revenue.amount} for revenue in revenues] 
    return jsonify(returndata)

@app.route('/validate', methods=['POST'])
def verifyCredentials():
    data = request.get_json()
    gotusername = data['username']
    gotpassword = data['password']
    user = Member.query.filter_by(username = gotusername).first()
    print(user)
    print(gotusername)
    print(gotpassword)
    print("printed")
        
    if user is None:

        return jsonify({"valid": False, "isAdmin": False, "fullname": ""}), 404
    else:
        if gotpassword == user.password:
            return jsonify({"valid": True, "isAdmin": user.isAdmin, "fullname": user.name})
        else:
            return jsonify({"valid": False, "isAdmin": False, "fullname": user.name}), 401
    


@app.route('/getpayments', methods=['POST'])
def getpayments():
    data = request.get_json()
    name = data['fullname']
    payments = Payment.query.filter_by(fullname=name).all()

    if not payments:
        return jsonify({"error": "No payments found for this fullname."}), 404

    payment_details = []
    for payment in payments:
        payment_details.append({
            'fullname': payment.fullname,
            'amount': payment.amount,
            'date': payment.date,
            'latefee': payment.latefee
        })
    print("returning payment of length " + str(len(payment_details)))
    return jsonify({'payments': payment_details}), 200
    
@app.route('/getattendance', methods=['POST'])
def getattendance():
    data = request.get_json()
    name = data['fullname']
    user = Attendance.query.filter_by(fullname = name).first()

    if user is None:
        return jsonify({"fullname": "", "date": ""}), 404
    else:
        payments = Attendance.query.filter_by(fullname=name).all()
        payment_details = [{'fullname': payment.fullname, 'date': payment.date} for payment in payments]
        print("returning attendance of length ", len(payments))
        return jsonify({'payments': payment_details}), 201


@app.route('/api/attendance', methods=['POST'])
def record_attendance():
    data = request.json
    attendance = Attendance(member_id=data['member_id'], paid=False)
    db.session.add(attendance)
    db.session.commit()
    return jsonify({'message': 'Attendance recorded'}), 201

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
    new_message = Message(user_id=data['userId'], message=data['message'])
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Message sent successfully"}), 201

if __name__ == '__main__':
    print("Current working directory:", os.getcwd())
    app.run(debug=True)