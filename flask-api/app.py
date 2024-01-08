from flask import Flask
from flask_cors import CORS

from api.routes import project_routes

app = Flask(__name__)
CORS(app)

# Register all route blueprints
app.register_blueprint(project_routes.bp)

# Run this before the app starts
with app.app_context():
    project_routes.initialise_dummy_data()

if __name__ == "__main__":

    app.run()
    