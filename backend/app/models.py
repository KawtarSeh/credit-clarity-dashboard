from .extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="analyst")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Client(db.Model):
    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True)

    # -------------------------
    # Optional identity fields
    # -------------------------
    nom = db.Column(db.String(100), nullable=True)
    prenom = db.Column(db.String(100), nullable=True)
    age = db.Column(db.Integer, nullable=True)

    # -------------------------
    # ML FEATURES (NUMERIC / CATEGORICAL)
    # -------------------------
    num_of_delayed_payment = db.Column(db.Float, nullable=True)
    changed_credit_limit = db.Column(db.Float, nullable=True)
    num_credit_inquiries = db.Column(db.Float, nullable=True)

    credit_mix = db.Column(db.String(50), nullable=True)

    outstanding_debt = db.Column(db.Float, nullable=True)
    credit_utilization_ratio = db.Column(db.Float, nullable=True)

    # Raw (optional – not used by ML)
    credit_history_age = db.Column(db.String(50), nullable=True)

    # ✅ Used by ML (IMPORTANT)
    credit_history_age_months = db.Column(db.Float, nullable=True)

    payment_of_min_amount = db.Column(db.String(20), nullable=True)
    total_emi_per_month = db.Column(db.Float, nullable=True)

    amount_invested_monthly = db.Column(db.Float, nullable=True)

    payment_behaviour = db.Column(db.String(100), nullable=True)

    monthly_balance = db.Column(db.Float, nullable=True)

    # -------------------------
    # ML OUTPUT
    # -------------------------
    credit_score = db.Column(db.String(20), nullable=True)

    # -------------------------
    # Timestamps
    # -------------------------
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )