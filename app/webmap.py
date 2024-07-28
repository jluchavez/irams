from flask import Blueprint, render_template, request, jsonify, redirect, url_for
import pandas as pd
import folium
import os

bp = Blueprint('webmap', __name__)

 
@bp.route('/webmap')
def webmap():
    # Load your datasets
    CURRENT_DIR = os.path.dirname(__file__)

    # First dataset
    file_path_1 = os.path.join(CURRENT_DIR, "data", "2019-2023.csv")
    data_1 = pd.read_csv(file_path_1)
    data_1['LATITUDE'] = data_1['LATITUDE'].astype(float)
    data_1['LONGITUDE'] = data_1['LONGITUDE'].astype(float)
    data_1 = data_1.dropna(subset=['LATITUDE', 'LONGITUDE'])

    # Second dataset
    file_path_2 = os.path.join(CURRENT_DIR, "data", "urdaneta.csv")
    data_2 = pd.read_csv(file_path_2)
    data_2['LATITUDE'] = data_2['LATITUDE'].astype(float)
    data_2['LONGITUDE'] = data_2['LONGITUDE'].astype(float)
    data_2 = data_2.dropna(subset=['LATITUDE', 'LONGITUDE'])

    # Convert datasets to dictionaries
    accidents_data_1 = data_1.to_dict(orient='records')
    accidents_data_2 = data_2.to_dict(orient='records')

    # Initialize the map centered at a specific location
    my_map = folium.Map(location=[15.9753, 120.5670], zoom_start=12)

    # Add markers for first dataset
    for accident in accidents_data_1:
        folium.Marker([float(accident['LATITUDE']), float(accident['LONGITUDE'])],
                      popup=f"<b>ID:</b> {accident['ID']}<br>"
                            f"<b>Barangay:</b> {accident['BARANGAY']}<br>"
                            f"<b>Date Committed:</b> {accident['DATE COMMITTED']}<br>").add_to(my_map)

    # Add markers for second dataset with different icon color (red)
    for accident in accidents_data_2:
        folium.Marker([float(accident['LATITUDE']), float(accident['LONGITUDE'])],
                      icon=folium.Icon(color='red'),
                      popup=f"<b>ID:</b> {accident['ID']}<br>"
                            f"<b>Barangay:</b> {accident['BARANGAY']}<br>").add_to(my_map)

    # Generate the prescription (assuming you have this function)
    prescription = generate_prescription(data_1)

    # Get unique barangays from data_2
    barangays_data_2 = data_2['BARANGAY'].unique().tolist()

    return render_template('webmap.html', my_map=my_map._repr_html_(),
                           accidents_data_1=accidents_data_1,
                           accidents_data_2=accidents_data_2,
                           prescription=prescription,
                           barangays_data_2=barangays_data_2)


@bp.route('/webmap/search')
def search():
    barangay = request.args.get('barangay')

    # Load data_2 again (or ensure data_2 is accessible here)
    CURRENT_DIR = os.path.dirname(__file__)
    file_path_2 = os.path.join(CURRENT_DIR, "data", "urdaneta.csv")
    data_2 = pd.read_csv(file_path_2)
    data_2['LATITUDE'] = data_2['LATITUDE'].astype(float)
    data_2['LONGITUDE'] = data_2['LONGITUDE'].astype(float)
    data_2 = data_2.dropna(subset=['LATITUDE', 'LONGITUDE'])

    # Filter accidents_data_2 by barangay
    filtered_accidents_data_2 = [accident for accident in data_2.to_dict(orient='records') if accident['BARANGAY'] == barangay]

    return jsonify(filtered_accidents_data_2)


def generate_prescription(data):
    # Group the data by Barangay and count the number of accidents
    barangay_accidents = data['BARANGAY'].value_counts().reset_index()
    barangay_accidents.columns = ['Barangay', 'Recorded number of']

    # Find the Barangays with the highest and lowest accident counts
    highest_accidents_barangay = barangay_accidents.iloc[0]
    second_highest_accidents_barangay = barangay_accidents.iloc[1]
    third_highest_accidents_barangay = barangay_accidents.iloc[2]

    # Find the top three Barangays with the lowest accident counts
    lowest_accidents_barangays = barangay_accidents.tail(3)

    # Generate the prescription string
    prescription = (f"From the past few years, the Barangay with the highest recorded number of road accidents is {highest_accidents_barangay['Barangay']} "
                    f"with {int(highest_accidents_barangay['Recorded number of'])} accidents, followed by {second_highest_accidents_barangay['Barangay']} "
                    f"with {int(second_highest_accidents_barangay['Recorded number of'])} accidents, and {third_highest_accidents_barangay['Barangay']} "
                    f"with {int(third_highest_accidents_barangay['Recorded number of'])} accidents. While the top three Barangays with the lowest recorded number of accidents "
                    f"are {', '.join([f'{row[0]} with {row[1]} accident' for row in lowest_accidents_barangays.values])}, respectively. "
                    f"It's crucial for our traffic enforcers and police officers to closely monitor the Barangays with high number of recorded accidents.")

    return prescription


@bp.route('/goto_homepage')
def go_to_homepage():
    # Redirect to the index homepage
    return redirect(url_for('homepage.homepage'))


@bp.route('/goto_visualization')
def go_to_visualization():
    # Redirect to the visualization page
    return redirect(url_for('visualization.visualization'))


@bp.route('/goto_report')
def go_to_report():
    # Redirect to the report page
    return redirect(url_for('report.report'))
