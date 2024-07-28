from flask import Flask, render_template, request, send_file, jsonify, redirect, url_for
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)

# Get the directory of the current Python file
CURRENT_DIR = os.path.dirname(__file__)

# Path to the CSV file
CSV_FILE_PATH = os.path.join(CURRENT_DIR, "data", "2019-2023.csv")

# def load_data():
#     if os.path.exists(CSV_FILE_PATH):
#         return pd.read_csv(CSV_FILE_PATH)
#     else:
#         print("CSV file not found.")
#         return pd.DataFrame()

def save_data(df):
    # Write DataFrame to CSV file
    df.to_csv(CSV_FILE_PATH, index=False)

def get_next_id(df):
    if df.empty:
        return '1'  # Return as string
    else:
        max_id = df['ID'].max()
        next_id = int(max_id) + 1
        return str(next_id)  # Convert the integer to string before returning


def validate_and_convert_date(day, month, year):
    try:
        date_obj = datetime(int(year), int(month), int(day))
        formatted_date = date_obj.strftime('%Y-%m-%d')
        return formatted_date
    except ValueError:
        return None

@app.route('/')
def index():
    return render_template('report.html')

@app.route('/get_csv_data', methods=['GET'])
def get_csv():
    return send_file(CSV_FILE_PATH, as_attachment=True)

@app.route('/submit-crime-report', methods=['POST'])
def submit_crime_report():
    form_data = request.form.to_dict()
    # df = load_data()

    # Convert date to datetime object
    date_committed = form_data.get('dateCommitted')
    try:
        date_obj = datetime.strptime(date_committed, '%Y-%m-%d')
    except ValueError:
        return 'Invalid date format'

    # Extract year, month, and day
    month_committed = date_obj.month
    day_committed = date_obj.day
    year_committed = date_obj.year

    # Create a new dictionary to store processed form data
    new_row_data = {
        'ID': int(get_next_id(df)),
        'Barangay': form_data.get('barangay'),
        'Date Committed': form_data.get('dateCommitted'),
        'Month Committed': month_committed,
        'Day Committed': day_committed,
        'Year Committed': year_committed,
        'Time Committed': form_data.get('time_committed'),
        'Offense': form_data.get('offense'),
        'Victims Age': form_data.get('victimsAge'),
        'Victims Gender': form_data.get('victimsGender'),
        'Suspects Age': form_data.get('suspectsAge'),
        'Suspects Gender': form_data.get('suspectsGender'),
        'Victims Count': form_data.get('victimsCount'),
        'Suspects Count': form_data.get('suspectsCount'),
        'Vehicle Kind': form_data.get('vehicleKind'),
        'Longitude': form_data.get('longitude'),
        'Latitude': form_data.get('latitude'),
        'Rainfall Index': form_data.get('rainfall'),
        'Maximum Temperature': form_data.get('tMax'),
        'Minimum Temperature': form_data.get('tMin'),
        'Wind Speed': form_data.get('wind_Speed'),
        'Wind Direction': form_data.get('wind_Direction')
    }

    # Convert new row data to DataFrame with a single row
    new_row_data = {col.upper(): val for col, val in new_row_data.items()}

    # Concatenate the new row with the existing DataFrame
    df = pd.concat([df, pd.DataFrame([new_row_data])], ignore_index=True)

    # Save the updated DataFrame
    save_data(df)
    return redirect(url_for('index'))

@app.route('/delete_row', methods=['POST'])
def delete_row():
    try:
        data = request.get_json()
        id_to_delete = data.get('id')

        # df = load_data()
        df = df[df['ID'] != id_to_delete]
        save_data(df)  # Uncommented save_data function call

        return jsonify({'message': 'Row deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# # Handle editing of row
# @app.route('/edit_row', methods=['POST'])
# def edit_row():
#     data = request.get_json()
#     id_to_edit = data.get('id')
#     new_data = data.get('newData')

#     df = load_data()
#     index_to_edit = df[df['ID'] == int(id_to_edit)].index[0]
#     # Update row with new data
#     df.loc[index_to_edit] = pd.Series(new_data, dtype=object)  # Use dtype=object to preserve ID as integer
#     # save_data(df)

#     return jsonify({'message': 'Row edited successfully'})
@app.route('/convert_date_format', methods=['POST'])
def convert_date():
    data = request.get_json()
    day = data.get('day')
    month = data.get('month')
    year = data.get('year')
    converted_date = validate_and_convert_date(day, month, year)
    if converted_date:
        return jsonify({'converted_date': converted_date})
    else:
        return jsonify({'error': 'Invalid date format'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5003)
