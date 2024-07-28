from flask import Flask, render_template
from flask import Flask, send_from_directory
app = Flask(__name__)


@app.route('/static/html/<path:filename>')
def serve_static(filename):
    return send_from_directory('static/html', filename)

@app.route('/')
def index():
    return render_template('webmap.html',)

if __name__ == '__main__':
    app.run(debug=True, port=5005)
