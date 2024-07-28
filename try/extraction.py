import csv, os
# Initialize an empty array to store the data from the 15th column
column_data = []
CURRENT_DIR = os.path.dirname(__file__)
CSV_FILE_PATH = os.path.join(CURRENT_DIR, "data", "2019-2023.csv")

with open(CSV_FILE_PATH, 'r') as csv_file:
    # Use DictReader to read the CSV file with column names
    csv_reader = csv.DictReader(csv_file)
    
    # Iterate through each row in the CSV file
    for row in csv_reader:
        # Extract data from the columns with titles 'Column_Title1' and 'Column_Title2'
        value1 = float(row['LATITUDE'])
        value2 = float(row['LONGITUDE'])
        
        # Append the extracted values to the column_data array as a list
        column_data.append([value1, value2])

# Print the extracted data
print(column_data)