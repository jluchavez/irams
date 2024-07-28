from flask import Flask, request, render_template, jsonify, send_file
import os
import pandas as pd

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('heatmap.html')


if __name__ == '__main__':
    app.run(debug=True, port=5604)
