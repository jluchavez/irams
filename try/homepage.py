from flask import Flask, render_template
from flask import Flask, send_from_directory
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import RandomOverSampler
from sklearn.model_selection import train_test_split, GridSearchCV

app = Flask(__name__)


# Load your dataset
file_path = 'D:/Road Accident/Dataset/2019-2023.csv'
data = pd.read_csv(file_path)

def preprocess_data(df):
    # Merge weather data with accident data based on timestamps
    df['DATE COMMITTED'] = pd.to_datetime(df['DATE COMMITTED'], format='%d/%m/%Y')
    # Feature engineering for weather conditions
    df['WIND CHILL'] = calculate_wind_chill(df['WIND_SPEED'], df['TMIN'])
    df['WEATHER CATEGORY'] = categorize_weather(df['RAINFALL'], df['TMAX'], df['TMIN'], df['WIND_SPEED'])

    # Extract time features from 'TIME COMMITTED'
    df['HOUR COMMITTED'] = pd.to_datetime(df['TIME COMMITTED'], format='%H:%M:%S').dt.hour
    df['MINUTE COMMITTED'] = pd.to_datetime(df['TIME COMMITTED'], format='%H:%M:%S').dt.minute

    # Drop unnecessary columns except 'VICTIMS COUNT'
    columns_to_drop = ['BARANGAY', 'TIME COMMITTED', 'OFFENSE', 'VEHICLE KIND', 'VICTIMS Gender', 'SUSPECTS Gender', 'VICTIMS Age', 'SUSPECTS Age', 'SUSPECTS COUNT', 'LONGITUDE', 'LATITUDE']
    df = df.drop(columns=columns_to_drop, axis=1)

    # Drop non-numeric columns before imputation
    numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
    df_numeric = df[numeric_columns]

    # Impute missing values for numeric columns only
    imputer = SimpleImputer(strategy='mean')
    df_numeric = pd.DataFrame(imputer.fit_transform(df_numeric), columns=df_numeric.columns)

    # Combine the imputed numeric columns with non-numeric columns
    df[df_numeric.columns] = df_numeric

    return df


def calculate_wind_chill(wind_speed, temperature):
    # Calculate wind chill using a common formula
    wind_chill = 35.74 + 0.6215 * temperature - 35.75 * (wind_speed ** 0.16) + 0.4275 * temperature * (wind_speed ** 0.16)
    return wind_chill

def categorize_weather(rainfall, max_temp, min_temp, wind_speed):
    # Categorize weather based on given parameters
    weather_category = []
    for idx in range(len(rainfall)):
        if rainfall[idx] > 4:
            weather_category.append('Rainy')
        elif max_temp[idx] > 35:
            weather_category.append('Hot')
        elif min_temp[idx] < 25:
            weather_category.append('Cold')
        else:
            weather_category.append('Normal')
    return weather_category


# Preprocess data using the existing dataset
df = data.copy()  # Create a copy of the DataFrame to avoid modifying the original
df = preprocess_data(df)

def create_monthly_data(df):
    # Ensure all months from 2019-2023 are covered
    years = range(2019, 2024)
    months = range(1, 13)
    all_months = [(year, month) for year in years for month in months]

    # Count the total accidents per month
    monthly_data = df.groupby(['YEAR COMMITTED', 'MONTH COMMITTED']).size().reset_index(name='ACCIDENT COUNT')

    # Fill missing months with zero accidents
    all_data = pd.DataFrame(all_months, columns=['YEAR COMMITTED', 'MONTH COMMITTED'])
    monthly_data = pd.merge(all_data, monthly_data, on=['YEAR COMMITTED', 'MONTH COMMITTED'], how='left').fillna(0)

    return monthly_data


def split_data_oversample(df, target='VICTIMS COUNT', test_size=0.3, random_state=42):
    features = df.drop(target, axis=1)
    target_values = df[target]

    oversampler = RandomOverSampler(sampling_strategy='auto', random_state=random_state)
    features_resampled, target_resampled = oversampler.fit_resample(features, target_values)

    X_train, X_test, y_train, y_test = train_test_split(features_resampled, target_resampled, test_size=test_size, random_state=random_state)

    return X_train, X_test, y_train, y_test

# Define functions for modeling
def tune_random_forest_parameters(X_train, y_train):
    param_grid = {
        'n_estimators': [50, 100, 200, 250, 300],
        'max_depth': [5, 10, 15, 20]
    }
    rf_regressor = RandomForestRegressor(random_state=42)
    grid_search = GridSearchCV(estimator=rf_regressor, param_grid=param_grid, scoring='neg_mean_squared_error', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    best_params = grid_search.best_params_
    return RandomForestRegressor(random_state=42, **best_params)


def predict_2024_accidents(rf_regressor, features):
    predicted_accidents_2024 = rf_regressor.predict(features)
    return predicted_accidents_2024

def generate_trend_plot(rf_regressor):
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
            name=str(year),
            line=dict(color='blue')  # Set the color for years 2019-2023 to blue
        ))

    fig.update_layout(
        title='Trend of Road Accidents (2019-2023)',
        xaxis_title='Month',
        yaxis_title='Number of Accidents',
        xaxis=dict(tickmode='array', tickvals=list(range(0, 12)),
                   ticktext=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    )

    # Generate predicted values for 2024 using your regression model
    months = np.unique(df['MONTH COMMITTED'])
    features_2024 = pd.DataFrame({'YEAR COMMITTED': [2024] * len(months), 'MONTH COMMITTED': months})
    predicted_values_2024 = predict_2024_accidents(rf_regressor, features_2024)  # Pass features as well

    # Add the predicted values to the plot
    fig.add_trace(go.Scatter(
        x=accidents_by_year_month.columns,
        y=predicted_values_2024,
        mode='lines+markers',
        name='Predicted 2024',
        line=dict(color='red')  # Set the color for Predicted 2024 to red
    ))

    # Convert the plot to HTML and return it
    trend_plot_html = fig.to_html(include_plotlyjs=False, full_html=False)

    return trend_plot_html


@app.route('/static/html/<path:filename>')
def serve_static(filename):
    return send_from_directory('static/html', filename)


@app.route('/')
def index():
    # Preprocess data using the existing dataset
    df = data.copy()  # Create a copy of the DataFrame to avoid modifying the original
    df = preprocess_data(df)
    monthly_data = create_monthly_data(df)  # Create monthly data with counted 'ACCIDENT COUNT'
    X_train, X_test, y_train, y_test = split_data_oversample(monthly_data, target='ACCIDENT COUNT')
    rf_regressor = tune_random_forest_parameters(X_train, y_train)
    rf_regressor.fit(X_train, y_train)

    trend_plot_html = generate_trend_plot(rf_regressor)

    return render_template('homepage.html', trend_plot_html=trend_plot_html)


if __name__ == '__main__':
    app.run(debug=True, port=5007)

