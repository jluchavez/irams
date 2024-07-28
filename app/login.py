from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db, User

bp = Blueprint('login', __name__)


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user'] = username  # Store the username in the session
            return jsonify({'redirect': url_for('report.report')})
        else:
            return jsonify({'error': 'Invalid username or password'})
    return render_template('login.html')


@bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if password != confirm_password:
            return jsonify({'error': 'Passwords do not match'})

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'Username is already taken'})

        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            print("There is an existing email address like this")
            return jsonify({'error': 'Email address is already registered'})

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'redirect': url_for('login.login')})
    return render_template('signup.html')


@bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return redirect(url_for('homepage.homepage'))
