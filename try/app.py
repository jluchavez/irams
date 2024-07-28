from flask import Flask, render_template
from flask import Flask, send_from_directory
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import calendar
import seaborn as sns
import io
import plotly.express as px
import plotly.io as pio
from plotly.subplots import make_subplots
import plotly.graph_objects as go

app = Flask(__name__)


def generate_trend_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Convert 'DATE COMMITTED' to datetime and then format it
    df['DATE COMMITTED'] = pd.to_datetime(df['DATE COMMITTED'])
    df['Month'] = df['DATE COMMITTED'].dt.strftime('%b')  # Get abbreviated month names
    df['Year'] = df['DATE COMMITTED'].dt.year

    # Group by Year and Month to count accidents
    accidents_by_year_month = df.groupby(['Year', 'Month']).size().unstack(fill_value=0)

    # Create a line chart using Plotly for each year
    fig = go.Figure()

    years = accidents_by_year_month.index.tolist()
    for year in years:
        fig.add_trace(go.Scatter(
            x=accidents_by_year_month.columns,
            y=accidents_by_year_month.loc[year],
            mode='lines+markers',
            name=str(year)
        ))

    fig.update_layout(
        title='Trend of Road Accidents (2019-2023)',
        xaxis_title='Month',
        yaxis_title='Number of Accidents',
        xaxis=dict(tickmode='array', tickvals=list(range(0, 12)),
                   ticktext=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    )

    # Convert the plot to HTML and return it
    trend_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return trend_plot_html


def generate_heatmap_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Count the number of accidents
    df['Number of Accidents'] = df.groupby(['DATE COMMITTED', 'TIME COMMITTED'])['DATE COMMITTED'].transform('count')

    # Convert 'TIME COMMITTED' to a string and then to datetime
    df['Hour'] = pd.to_datetime(df['TIME COMMITTED'].astype(str), format='%H:%M:%S').dt.hour

    # Extract month from the 'DATE COMMITTED' column
    df['Month'] = pd.to_datetime(df['DATE COMMITTED']).dt.month

    # Create a pivot table for the heatmap with Hour and Month
    heatmap_data = df.pivot_table(index='Hour', columns='Month', values='Number of Accidents', aggfunc='sum')

    # Fill NaN values with white color in the heatmap
    heatmap_data = heatmap_data.fillna(0)  # Replace NaN with 0 (no accidents)
    heatmap_data = heatmap_data.mask(heatmap_data == 0, 0)  # Replace 0 with 0 for plotting

    # Create a heatmap using Plotly
    fig = go.Figure(data=go.Heatmap(
        z=heatmap_data.values.tolist(),
        x=heatmap_data.columns,
        y=heatmap_data.index,
        colorscale='YlOrRd'
    ))

    fig.update_layout(
        title='Time Series Heatmap',
        xaxis_title='Month',
        yaxis_title='Hour',
        xaxis=dict(tickmode='array', tickvals=list(range(1, 13)), ticktext=[str(i) for i in range(1, 13)]),
        yaxis=dict(tickmode='array', tickvals=list(range(24)), ticktext=[str(i) for i in range(24)]),
        coloraxis_colorbar=dict(
            tickvals=[],  # Remove tick values on the color bar
            ticktext=[''],  # Set empty strings as labels
            ticks='',  # Remove numerical ticks on color bar
            title='Number of Accidents',  # Set color bar title
            titlefont=dict(size=14)  # Adjust color bar title font size
        )
    )

    # Convert the plot to HTML and return it
    heatmap_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return heatmap_plot_html


def generate_month_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Convert 'DATE COMMITTED' to datetime and then format it
    df['DATE COMMITTED'] = pd.to_datetime(df['DATE COMMITTED']).dt.strftime('%m/%d/%Y')

    # Extract year and month from 'DATE COMMITTED' column
    df['Year'] = pd.to_datetime(df['DATE COMMITTED']).dt.year
    df['Month'] = pd.to_datetime(df['DATE COMMITTED']).dt.month_name().str.slice(stop=3)  # Get abbreviated month names

    # Get unique years in the dataset
    years = df['Year'].unique()

    # Count the number of accidents per month for each year
    accidents_by_year = {year: df[df['Year'] == year]['Month'].value_counts().sort_index() for year in years}

    # Create a bar chart using Plotly for each year
    fig = go.Figure()

    for year in years:
        fig.add_trace(go.Bar(
            x=accidents_by_year[year].index,
            y=accidents_by_year[year].values,
            name=f'{year}'
        ))

    fig.update_layout(
        title='Number of Road Accidents by Month',
        xaxis_title='Month',
        yaxis_title='Number of Accidents',
        barmode='group',  # Group bars for different years
        xaxis=dict(tickmode='array', tickvals=list(range(0, 12)), ticktext=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    )

    # Convert the plot to HTML and return it
    month_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return month_plot_html


def generate_location_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Count the number of road accidents for each barangay
    barangay_counts = df['BARANGAY'].value_counts()

    # Define colors for bars
    colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']

    # Create a bar chart using Plotly with specified colors
    fig = go.Figure(go.Bar(
        x=barangay_counts.index,
        y=barangay_counts.values,
        marker_color=[colors[i % len(colors)] for i in range(len(barangay_counts))],  # Repeat colors if necessary
        text=barangay_counts.values,
        textposition='auto'
    ))

    fig.update_layout(
        title='Road Accidents From Different Barangays',
        xaxis_title='Locations',
        yaxis_title='Number of Road Accidents',
        xaxis_tickangle=-45,  # Rotate x-axis labels for better visibility
    )

    # Convert the plot to HTML and return it
    location_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return location_plot_html

def generate_offense_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)

    # Drop unnecessary columns
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Count the number of offenses for each offense type
    offenses_counts = df['OFFENSE'].value_counts()

    # Display the top 10 offenses for better visualization
    top_offenses = offenses_counts.nlargest(10)

    # Define colors for bars
    colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b']

    # Create a bar chart using Plotly with custom colors
    fig = go.Figure(go.Bar(
        x=top_offenses.index,
        y=top_offenses.values,
        marker_color=colors[:len(top_offenses)],  # Set colors for bars
        text=top_offenses.index,  # Set text to be displayed on hover (x-axis labels)
        hoverinfo='text+y',  # Show x-axis label and y-value on hover
    ))

    fig.update_layout(
        title='Offenses Recorded',
        yaxis_title='Number of Occurrences',  # Update y-axis label only
        xaxis_visible=False,  # Hide the x-axis
    )

    # Convert the plot to HTML and return it
    offense_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return offense_plot_html

def generate_vehicle_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)

    # Drop unnecessary columns
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Split vehicle kinds containing commas into separate rows
    df = df.drop('VEHICLE KIND', axis=1).join(
        df['VEHICLE KIND'].str.split(',', expand=True).stack().reset_index(level=1, drop=True).rename('VEHICLE KIND'))

    # Count the number of occurrences for each vehicle kind
    vehicle_counts = df['VEHICLE KIND'].value_counts()

    # Define colors for bars
    colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']

    # Create a bar chart using Plotly with specified colors
    fig = go.Figure(go.Bar(
        x=vehicle_counts.index,
        y=vehicle_counts.values,
        marker_color=[colors[i % len(colors)] for i in range(len(vehicle_counts))],  # Repeat colors if necessary
        text=vehicle_counts.values,
        textposition='auto'
    ))

    fig.update_layout(
        title='Vehicles Involved in Road Accidents',
        xaxis_title='Vehicle Kind',
        yaxis_title='Number of Occurrences',
        xaxis_tickangle=-45,  # Rotate x-axis labels for better readability
    )

    # Convert the plot to HTML and return it
    vehicle_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return vehicle_plot_html

def generate_number_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)

    # Drop unnecessary columns
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Convert 'DATE COMMITTED' to datetime and then format it
    df['DATE COMMITTED'] = pd.to_datetime(df['DATE COMMITTED']).dt.strftime('%m/%d/%Y')

    # Extract year from 'DATE COMMITTED' column
    df['Year'] = pd.to_datetime(df['DATE COMMITTED']).dt.year

    # Count the number of victims and suspects per year
    victims_suspects_by_year = df.groupby('Year')[['VICTIMS COUNT', 'SUSPECTS COUNT']].sum()

    # Create a bar chart using Plotly
    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=victims_suspects_by_year.index,
        y=victims_suspects_by_year['VICTIMS COUNT'],
        name='Victims',
        marker_color='#1f77b4'  # Set color for victims
    ))
    fig.add_trace(go.Bar(
        x=victims_suspects_by_year.index,
        y=victims_suspects_by_year['SUSPECTS COUNT'],
        name='Suspects',
        marker_color='#ff7f0e'  # Set color for suspects
    ))

    fig.update_layout(
        title='Number of Victims and Suspects',
        xaxis_title='Year',
        yaxis_title='Count',
        barmode='group'  # Group bars for each year
    )

    # Convert the plot to HTML and return it
    number_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return number_plot_html

def generate_gender_plot():
    # Load dataset
    file_path = r'D:/Road Accident/Dataset/2019-2023.csv'
    df = pd.read_csv(file_path)

    # Drop unnecessary columns
    columns_to_drop = ['RAINFALL', 'TMAX', 'TMIN', 'WIND_SPEED', 'WIND_DIRECTION', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Convert 'DATE COMMITTED' to datetime and then format it
    df['DATE COMMITTED'] = pd.to_datetime(df['DATE COMMITTED']).dt.strftime('%m/%d/%Y')

    # Extract year from 'DATE COMMITTED' column and create 'Year' column
    df['Year'] = pd.to_datetime(df['DATE COMMITTED']).dt.year

    # Initialize lists to store data for Plotly
    victims_female_count = []
    victims_male_count = []
    suspects_female_count = []
    suspects_male_count = []

    years = list(range(2019, 2024))

    for year in years:
        # Filter data for the current year
        df_year = df[df['Year'] == year]

        # Convert 'M' and 'F' to 0 and 1
        df_year['VICTIMS Gender'] = df_year['VICTIMS Gender'].map({'M': 0, 'F': 1})
        df_year['SUSPECTS Gender'] = df_year['SUSPECTS Gender'].map({'M': 0, 'F': 1})

        # Count the occurrences of each gender for victims and suspects
        victims_male_count.append(len(df_year[df_year['VICTIMS Gender'] == 0]))
        victims_female_count.append(len(df_year[df_year['VICTIMS Gender'] == 1]))
        suspects_male_count.append(len(df_year[df_year['SUSPECTS Gender'] == 0]))
        suspects_female_count.append(len(df_year[df_year['SUSPECTS Gender'] == 1]))

    # Create a bar chart using Plotly
    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=years,
        y=victims_female_count,
        name='Victims Female',
        marker_color='lightblue'
    ))
    fig.add_trace(go.Bar(
        x=years,
        y=victims_male_count,
        name='Victims Male',
        marker_color='blue'
    ))
    fig.add_trace(go.Bar(
        x=years,
        y=suspects_female_count,
        name='Suspects Female',
        marker_color='yellow'
    ))
    fig.add_trace(go.Bar(
        x=years,
        y=suspects_male_count,
        name='Suspects Male',
        marker_color='orange'
    ))

    fig.update_layout(
        title='Gender of Victims and Suspects',
        xaxis_title='Year',
        yaxis_title='Count',
        barmode='group'  # Group bars for each year
    )

    # Update x-axis tick labels to include all years from 2019 to 2023
    fig.update_xaxes(tickvals=years, ticktext=[str(year) for year in years])

    # Convert the plot to HTML and return it
    gender_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return gender_plot_html


@app.route('/static/html/<path:filename>')
def serve_static(filename):
    return send_from_directory('static/html', filename)


@app.route('/')
def index():

    trend_plot_html = generate_trend_plot()
    heatmap_plot_html = generate_heatmap_plot()
    month_plot_html = generate_month_plot()
    location_plot_html = generate_location_plot()
    offense_plot_html = generate_offense_plot()
    vehicle_plot_html = generate_vehicle_plot()
    number_plot_html = generate_number_plot()
    gender_plot_html = generate_gender_plot()

    return render_template('index.html', trend_plot_html=trend_plot_html,
                           heatmap_plot_html=heatmap_plot_html, month_plot_html=month_plot_html,
                           location_plot_html=location_plot_html, offense_plot_html=offense_plot_html,
                           vehicle_plot_html=vehicle_plot_html, number_plot_html=number_plot_html,
                           gender_plot_html=gender_plot_html)


if __name__ == '__main__':
    app.run(debug=True, port=5001)

