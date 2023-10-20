import csv
import json
import sys

if len(sys.argv) != 4:
    print("Usage: csv_to_json.py src_name.csv dest_name.json num_branches_per_node")
    exit(1)

data = {} # dictionary

# Open CSV file with a CSV reader 
with open(sys.argv[1], encoding = 'utf-8') as csvfile:
    csvReader = csv.DictReader(csvfile)

    for rows in csvReader:
        # Get the key of each row as the node ID
        key = rows['ID']

        # Split rows that should be arrays (branch IDs, etc) delimited by commas    
        rows['Branches'] = rows['Branches'].split(',')
        rows['Types'] = rows['Types'].split(',')
        rows['Texts'] = rows['Texts'].split(',')

        # Set the key/value pair in the data dict
        data[key] = rows

# Append every entry of the data dict to an array, as this should
# be formatted in the JSON file as an array of objects
arr = []
for pair in data:
    arr.append(data[pair])

# Re-format this into a dict, because python JSON lib likes dicts,
# with only two key/value pairs: number of branches per node, and the tree of nodes
data = {'BranchCount': int(sys.argv[3]), 'Tree': arr}

# Dump the data dict to JSON using JSON lib
with open(sys.argv[2], 'w', encoding = 'utf-8') as jsonfile:
    # Convert ID entries to integers, instead of strings
    for entry in data['Tree']:
        entry['ID'] = int(entry['ID'])

    # Initially dump the JSON data to a variable, so that
    # undesired characters can be stripped before the file write
    out = json.dumps(data, indent = 4)
    out = out.replace('\"\"', '')
    out = out.replace('\" ', '\"')
    jsonfile.write(out)
