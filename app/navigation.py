from flask import Flask, render_template, request, send_file, jsonify, redirect, url_for
from flask import Blueprint, render_template, redirect, url_for

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('navigation.html')


if __name__ == '__main__':
    app.run(debug=True, port=5504)
