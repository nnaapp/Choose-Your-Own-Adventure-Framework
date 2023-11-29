import csv
import json
import sys

if len(sys.argv) != 4:
    print("Usage: csv_to_json.py tree.csv types.csv dest.json")
    exit(1)

types = [] # type list
colors = [] # color list
hovercolors = [] # color for mouse hover list
bordercolors = [] # accent color list
data = {} # tree data dictionary

# Open type/color CSV file with a CSV reader
with open(sys.argv[2], encoding = 'utf-8') as csvfile:
    csvReader = csv.DictReader(csvfile)

    for rows in csvReader:
        types.append(rows['Type'])
        colors.append(rows['Color'])
        hovercolors.append(rows['HoverColor'])
        bordercolors.append(rows['BorderColor'])

# Open tree CSV file with a CSV reader 
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
treeArr = []
for pair in data:
    treeArr.append(data[pair])

branchCount = input("How many branches per node (non-leaf-node)? ")
title = input("What is the title header? ")
lowerTitle = input("What is the title subtext? ")

fontFamily = []
fontFamily.append(input("What font do you want to use? "))
fontFamily.append(input("What 1st backup font do you want to use? "))
fontFamily.append(input("What 2nd backup font do you want to use? "))
    
# Re-format this into a dict, because python JSON lib likes dicts,
# with only two key/value pairs: number of branches per node, and the tree of nodes
data = {'Title': title, 'TitleSubtext': lowerTitle, 'Fonts': fontFamily, 'Types': types, 'Colors': colors, 'HoverColors': hovercolors, 'BorderColors': bordercolors, 'BranchCount': int(branchCount), 'Tree': treeArr}

# Dump the data dict to JSON using JSON lib
with open(sys.argv[3], 'w', encoding = 'utf-8') as jsonfile:
    # Convert ID entries to integers, instead of strings
    for entry in data['Tree']:
        entry['ID'] = int(entry['ID'])
        for i in range(0, len(entry['Branches'])):
            if entry['Branches'][i].isdigit():
                entry['Branches'][i] = int(entry['Branches'][i])

    # Initially dump the JSON data to a variable, so that
    # undesired characters can be stripped before the file write
    out = json.dumps(data, indent = 4)
    out = out.replace('\"\"', '')
    out = out.replace('\" ', '\"')
    jsonfile.write(out)
