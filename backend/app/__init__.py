from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt
from . import models  # Import models to register them with SQLAlchemy
from .routes.auth import auth_bp
from .routes.clients import clients_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:8080"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(clients_bp, url_prefix="/api")
    


    @app.route("/")
    def home():
        return {"status": "Flask API is running"}

    return app
