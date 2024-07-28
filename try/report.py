from flask import Flask, render_template, request, send_file, jsonify, redirect, url_for
import pandas as pd
import os, csv
from datetime import datetime

app = Flask(__name__)

# Constants
CURRENT_DIR = os.path.dirname(__file__)
CSV_FILE_PATH = os.path.join(CURRENT_DIR, "data", "2019-2023.csv")

# Helper functions
def load_data():
    if os.path.exists(CSV_FILE_PATH):
        # Load CSV data
        df = pd.read_csv(CSV_FILE_PATH)

        # Drop rows with non-finite ID values
        df = df.dropna(subset=['ID'])

        # Convert the 'ID' column to integers
        df['ID'] = df['ID'].astype(int)
        
        return df
    else:
        print("CSV file not found.")
        return pd.DataFrame()

def format_date(date_str):
    # Assuming the input date is in the format 'DD/MM/YYYY'
    datetime_obj = datetime.strptime(date_str, '%Y-%m-%d')
    # Format the date to 'YYYY-MM-DD'
    return datetime_obj.strftime('%m/%d/%Y')

def save_data(df):
    df.to_csv(CSV_FILE_PATH, index=False)


def get_next_id(df):
    try:
        if df.empty:
            return 1  # Start with ID 1 if DataFrame is empty
        else:
            return int(df['ID'].max()) + 1  # Cast the result to integer
    except Exception as e:
        print(f"Error getting next ID: {str(e)}")
        return 1  # Return 1 in case of any error

# Routes
@app.route('/')
def index():
    return render_template('report.html')

@app.route('/get_csv_data')
def get_csv_data():
    if os.path.exists(CSV_FILE_PATH):
        return send_file(CSV_FILE_PATH, as_attachment=True)
    else:
        return "CSV file not found."


@app.route('/submit-crime-report', methods=['POST'])
def submit_crime_report():
    try:
        form_data = request.form.to_dict()

        # Load data
        df = load_data()

        # Convert date
        date = form_data.get('dateCommitted')
        date_committed = format_date(date)
        date_obj = datetime.strptime(date_committed, '%m/%d/%Y')

        # Extract year, month, and day
        month_committed = date_obj.month
        day_committed = date_obj.day
        year_committed = date_obj.year

        time_committed = form_data.get('timeCommitted') + ':00'

        # Create a new dictionary to store processed form data
        new_row_data = {
            'ID': get_next_id(df),
            'BARANGAY': form_data.get('barangay'),
            'DATE COMMITTED': date_committed,
            'MONTH COMMITTED': month_committed,
            'DAY COMMITTED': day_committed,
            'YEAR COMMITTED': year_committed,
            'TIME COMMITTED': time_committed,
            'OFFENSE': form_data.get('offense'),
            'VICTIMS Age': form_data.get('victimsAge'),
            'VICTIMS Gender': form_data.get('victimsGender'),
            'SUSPECTS Age': form_data.get('suspectsAge'),
            'SUSPECTS Gender': form_data.get('suspectsGender'),
            'VICTIMS COUNT': form_data.get('victimsCount'),
            'SUSPECTS COUNT': form_data.get('suspectsCount'),
            'VEHICLE KIND': form_data.get('vehicleKind'),
            'LONGITUDE': form_data.get('longitude'),
            'LATITUDE': form_data.get('latitude'),
            'RAINFALL': form_data.get('rainfall'),
            'TMAX': form_data.get('tMax'),
            'TMIN': form_data.get('tMin'),
            'WIND_SPEED': form_data.get('windSpeed'),
            'WIND_DIRECTION': form_data.get('windDirection')
        }
        
        # Update DataFrame
        df = pd.concat([df, pd.DataFrame([new_row_data])], ignore_index=True)

        # Save data
        save_data(df)

        return redirect(url_for('index'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_row', methods=['POST'])
def delete_row():
    data = request.get_json()
    id_to_delete = data.get('id')

    try:
        # Attempt to convert id_to_delete to integer
        id_to_delete = int(float(id_to_delete))  # Convert to float first to handle cases like '653.0'
    except ValueError:
        return jsonify({'error': 'Invalid ID value'}), 400

    df = load_data()
    df = df[df['ID'] != id_to_delete]  # Remove row with specified ID
    save_data(df)

    return jsonify({'message': 'Row deleted successfully'})

@app.route('/edit_row', methods=['POST'])
def edit_row():
    if request.method == 'POST':
        edited_data = request.json

        # Format the date before updating the CSV file
        edited_data['date'] = format_date(edited_data['date'])

        # Convert the date string to a datetime object
        date_obj = datetime.strptime(edited_data['date'], '%m/%d/%Y')

        # Extract day, month, and year
        day_committed = date_obj.day
        month_committed = date_obj.month
        year_committed = date_obj.year

        # Ensure time input format is HH:MM:SS
        time_committed = edited_data['time']
        if len(time_committed.split(':')) == 2:
            time_committed += ':00'
        # Read the existing CSV data
        with open(CSV_FILE_PATH, 'r', newline='') as file:
            reader = csv.DictReader(file)
            rows = list(reader)

        # Update the corresponding row with the edited data
        for row in rows:
            if row['ID'] == edited_data['id']:
                row['OFFENSE'] = edited_data['crimeType']
                row['DATE COMMITTED'] = edited_data['date']
                row['TIME COMMITTED'] = time_committed
                row['VICTIMS Age'] = edited_data['victimAge']
                row['VICTIMS Gender'] = edited_data['victimGender']
                row['SUSPECTS Age'] = edited_data['suspectAge']
                row['SUSPECTS Gender'] = edited_data['suspectGender']
                row['VICTIMS COUNT'] = edited_data['victimCount']
                row['SUSPECTS COUNT'] = edited_data['suspectCount']
                row['VEHICLE KIND'] = edited_data['vehicleKind']
                row['LONGITUDE'] = edited_data['longitude']
                row['LATITUDE'] = edited_data['latitude']
                row['RAINFALL'] = edited_data['rainfall']
                row['TMAX'] = edited_data['tmax']
                row['TMIN'] = edited_data['tmin']
                row['WIND_SPEED'] = edited_data['windSpeed']
                row['WIND_DIRECTION'] = edited_data['windDirection']
                row['BARANGAY'] = edited_data['location']
                
                # Update day, month, and year
                row['DAY COMMITTED'] = day_committed
                row['MONTH COMMITTED'] = month_committed
                row['YEAR COMMITTED'] = year_committed
                break

        # Write the updated data back to the CSV file
        with open(CSV_FILE_PATH, 'w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=reader.fieldnames)
            writer.writeheader()
            writer.writerows(rows)

        return jsonify({'message': 'Data updated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5003)
