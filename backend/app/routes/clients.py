from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required
from math import ceil

from app.extensions import db
from app.models import Client

clients_bp = Blueprint("clients", __name__)

@clients_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:8080")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
        return response, 200


# =====================================================
# SERIALIZER (MATCH FRONTEND Client TYPE)
# =====================================================
def client_to_dict(client: Client):
    return {
        "id": client.id,

        "nom": client.nom,
        "prenom": client.prenom,
        "age": client.age,

        "num_of_delayed_payment": client.num_of_delayed_payment,
        "changed_credit_limit": client.changed_credit_limit,
        "num_credit_inquiries": client.num_credit_inquiries,
        "credit_mix": client.credit_mix,
        "outstanding_debt": client.outstanding_debt,
        "credit_utilization_ratio": client.credit_utilization_ratio,
        "credit_history_age": client.credit_history_age,
        "credit_history_age_months": client.credit_history_age_months,
        "payment_of_min_amount": client.payment_of_min_amount,
        "total_emi_per_month": client.total_emi_per_month,
        "amount_invested_monthly": client.amount_invested_monthly,
        "payment_behaviour": client.payment_behaviour,
        "monthly_balance": client.monthly_balance,

        "credit_score": client.credit_score,

        "created_at": client.created_at.isoformat() if client.created_at else None,
        "updated_at": client.updated_at.isoformat() if client.updated_at else None,
    }

# =====================================================
# CREATE CLIENT
# =====================================================
@clients_bp.post("/clients")
def create_client():
    data = request.get_json()
    client = Client(**data)

    db.session.add(client)
    db.session.commit()

    return jsonify(client_to_dict(client)), 201

# =====================================================
# GET ALL CLIENTS (PAGINATED & FILTERED)
# =====================================================
@clients_bp.get("/clients")
def get_clients():
    # -------- Query params ----------
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("pageSize", 10))
    credit_mix = request.args.get("credit_mix")
    credit_score = request.args.get("credit_score")
    search = request.args.get("search")

    query = Client.query

    # -------- Filters ----------
    if credit_mix:
        query = query.filter(Client.credit_mix == credit_mix)

    if credit_score:
        query = query.filter(Client.credit_score == credit_score)

    if search:
        query = query.filter(
            (Client.nom.ilike(f"%{search}%")) |
            (Client.prenom.ilike(f"%{search}%"))
        )

    # -------- Pagination ----------
    total = query.count()
    clients = (
        query
        .order_by(Client.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    total_pages = ceil(total / page_size) if page_size else 1

    return jsonify({
        "data": [client_to_dict(c) for c in clients],
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": total_pages,
    }), 200

# =====================================================
# GET CLIENT BY ID
# =====================================================
@clients_bp.get("/clients/<int:client_id>")
@jwt_required()
def get_client(client_id):
    client = db.session.get(Client, client_id)

    if not client:
        return jsonify({"message": "Client not found"}), 404

    return jsonify(client_to_dict(client)), 200

# =====================================================
# UPDATE CLIENT
# =====================================================
@clients_bp.patch("/clients/<int:client_id>")
@jwt_required()
def update_client(client_id):
    client = db.session.get(Client, client_id)

    if not client:
        return jsonify({"message": "Client not found"}), 404

    data = request.get_json()

    for key, value in data.items():
        if hasattr(client, key):
            setattr(client, key, value)

    db.session.commit()

    return jsonify(client_to_dict(client)), 200

# =====================================================
# DELETE CLIENT
# =====================================================
@clients_bp.delete("/clients/<int:client_id>")
@jwt_required()
def delete_client(client_id):
    client = db.session.get(Client, client_id)

    if not client:
        return jsonify({"message": "Client not found"}), 404

    db.session.delete(client)
    db.session.commit()

    return jsonify({"success": True}), 200
