import pandas as pd

# Reading the data from the CSV file
df = pd.read_csv("C:/Users/asus/Downloads/RoadPrediction/try/static/html/2019-2023 with coordinates.csv", sep=",")

# Dropping duplicate rows to get unique Barangays with their Latitude and Longitude
unique_df = df.drop_duplicates()

# Keep track of printed barangays
printed_barangays = set()

# Printing the unique Barangays with their Latitude and Longitude
for index, row in unique_df.iterrows():
    barangay = row['BARANGAY']
    if barangay not in printed_barangays:
        print(f"Barangay: {barangay}, Latitude: {row['LATITUDE']}, Longitude: {row['LONGITUDE']}")
        printed_barangays.add(barangay)
