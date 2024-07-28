from flask import Blueprint, render_template, session, redirect, url_for, request, flash
from sqlalchemy.orm import joinedload
from app.models import db, User, Report

bp = Blueprint('user', __name__)

@bp.route('/users', methods=['GET'])
def view_users():
    if 'user' not in session:
        return redirect(url_for('login.login'))

    users = User.query.all()  # Fetch all users
    crime_reports = Report.query.options(joinedload(Report.user)).all()  # Fetch all reports with user details
    return render_template('user.html', users=users, crime_reports=crime_reports)

@bp.route('/delete_user/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    if 'user' not in session:
        return redirect(url_for('login.login'))

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    flash('User deleted successfully', 'success')
    return redirect(url_for('user.view_users'))

@bp.route('/delete_report/<int:report_id>', methods=['POST'])
def delete_report(report_id):
    if 'user' not in session:
        return redirect(url_for('login.login'))

    report = Report.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()
    flash('Report deleted successfully', 'success')
    return redirect(url_for('user.view_users'))
