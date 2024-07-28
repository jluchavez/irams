from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.models import db
from app import homepage, webmap, visualization, report, login, user

app = Flask(__name__)
app.secret_key = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Create the database tables
with app.app_context():
    db.create_all()

# Register blueprints
app.register_blueprint(homepage.bp)
app.register_blueprint(webmap.bp)
app.register_blueprint(visualization.bp)
app.register_blueprint(report.bp)
app.register_blueprint(login.bp)
app.register_blueprint(user.bp)
