from app import create_app

app = create_app()

if __name__ == "__main__":
    # Use Flask's built-in server for local development
    app.run(debug=app.config.get("DEBUG", False))
