from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance_tracker.db'
db = SQLAlchemy(app)
CORS(app)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Transaction {self.id}>"

# Create the database tables
with app.app_context():
    db.create_all()

@app.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([{
        'id': t.id,
        'date': t.date,
        'description': t.description,
        'amount': t.amount,
        'category': t.category
    } for t in transactions])

@app.route('/transaction', methods=['POST'])
def add_transaction():
    data = request.get_json()
    new_transaction = Transaction(
        date=data['date'],
        description=data['description'],
        amount=data['amount'],
        category=data['category']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added'}), 201

@app.route('/balance', methods=['GET'])
def get_balance():
    expenses = db.session.query(db.func.sum(Transaction.amount)).filter(Transaction.amount < 0).scalar() or 0
    income = db.session.query(db.func.sum(Transaction.amount)).filter(Transaction.amount > 0).scalar() or 0
    balance = income + expenses
    return jsonify({'balance': balance})

if __name__ == '__main__':
    app.run(debug=True)
