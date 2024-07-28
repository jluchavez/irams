from flask import Flask, request, render_template, jsonify, send_file
import os
import pandas as pd

app = Flask(__name__)

CSV_DIR = 'D:/Road Accident/Dataset/'
CSV_FILE = '2019-2023.csv'

csv_path = os.path.join(CSV_DIR, CSV_FILE)
if os.path.exists(csv_path):
    crime_data = pd.read_csv(csv_path)
else:
    crime_data = pd.DataFrame()

@app.route('/')
def index():
    return render_template('display.html')

@app.route('/get_csv_data')
def get_csv_data():
    if os.path.exists(csv_path):
        return send_file(csv_path, as_attachment=True)
    else:
        return "CSV file not found."

@app.route('/save_changes', methods=['POST'])
def save_changes():
    global crime_data
    edited_row = request.get_json()

    # Update the dataset with the edited row
    updated_data = update_dataset(edited_row)

    # Save the updated data back to CSV
    updated_data.to_csv(csv_path, index=False)
    crime_data = updated_data  # Update the global dataset

    return jsonify(success=True)

def update_dataset(edited_row):
    global crime_data
    # Find the index of the row to be updated
    index_to_update = crime_data.index[crime_data['Barangay'] == edited_row['Barangay']].tolist()
    if index_to_update:
        index_to_update = index_to_update[0]
        # Update the row with the edited values
        for key, value in edited_row.items():
            crime_data.at[index_to_update, key] = value

    return crime_data  # Return the updated dataset

if __name__ == '__main__':
    app.run(debug=True, port=5004)
