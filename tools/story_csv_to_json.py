import sys

if len(sys.argv) != 5:
    print("Usage: story_csv_to_json.py src_name.csv num_nodes num_branches_per_node dest_name.json")
    exit(1)

# Open source CSV and dest JSON
csv = open(sys.argv[1], "r")
json = open(sys.argv[4], "w")

# Get number of nodes total, and number of branches per node
numNodes = int(sys.argv[2])
numBranches = int(sys.argv[3])

# Set up start of JSON with open brace, branches per node, and tree array header
json.write("{\n\t")
json.write("\"branchCount\": " + str(numBranches) + ",\n\t")
json.write("\"tree\": [\n\t\t")

#TODO: make this less of an abomination
csvIndex = 0 # Count of what node we are on
for line in csv:
    # for the current line in the CSV, strip the newline and split it into an array, delimited by commas
    currentVals = line.strip("\n").split(",")
    # Current index in the array, helps for variadic amounts of branches per node
    valsIndex = 0

    # If the first entry on this line is non-numeric, it is probably a header line, so skip it
    if currentVals[valsIndex].isnumeric() == False:
        continue

    # Open current tree entry
    json.write("{\n\t\t\t")

    # Write ID of node, increment to next index
    json.write("\"id\": " + currentVals[valsIndex] + ",\n\t\t\t")
    valsIndex += 1

    # Write each branch ID in brackets, incrementing index every time
    json.write("\"branches\": [")
    # For valsIndex to (valsIndex + numBranches)
    for i in range(valsIndex, valsIndex + numBranches):
        # Exporting CSV from Excel adds quotes around a cell containing a comma, this strips that
        currentBranchID = currentVals[i].strip("\"")

        # If the first branch is "", this is a leaf node, so stop reading and move on
        if currentBranchID == "":
            break

        # Write the current branch ID, and write a comma if this is NOT the last entry in the branch array
        json.write(currentBranchID)
        if i != valsIndex + numBranches - 1:
            json.write(", ")

    # Close the array of branches
    json.write("], \n\t\t\t")
    # Set the index of the current line to the LAST element,
    # as this handles variadic amounts of branches better, specifically for leaf nodes with no branches
    valsIndex = len(currentVals) - 1

    # Write prompt and end the current entry
    json.write("\"prompt\": \"" + currentVals[valsIndex] + "\"\n\t\t")
    
    # Comma if not the last tree entry
    if csvIndex != numNodes - 1:
        json.write("},\n\t\t")
        csvIndex += 1
        continue
    
    # No comma if last tree entry
    json.write("}\n\t\t")

# Close the tree array and close the JSON braces
json.write("]\n")
json.write("}")

# Close files and exit
json.close()
csv.close()
