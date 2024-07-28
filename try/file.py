import pandas as pd

# Define the path to the CSV file
CSV_FILE_PATH = 'C:/Users/asus/Downloads/RoadPrediction/try/static/html/2019-2023 with coordinates.csv'

def print_csv_contents(csv_file_path):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file_path)

    # Print the DataFrame
    print(df)

if __name__ == "__main__":
    print_csv_contents(CSV_FILE_PATH)
