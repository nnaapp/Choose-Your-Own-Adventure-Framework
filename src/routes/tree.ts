/**
* Story node, links to the next n nodes,
* and stores a prompt to be presented to the player
*/
export class StoryNode 
{
    // Array of branches from node
    private branches: Branch[];
    // Number of branches node possesses
    private branchCount: number;
    // Text prompt of node
    private prompt: string;

    /**
    * @param {string} prompt Prompt, defaults to "".
    * @param {number} branchCount Number of branches, defaults to 2.
    */
    constructor(prompt: string, branchCount: number) 
    {
        this.prompt = prompt;
        this.branchCount = branchCount;
        this.branches = new Array(this.branchCount);
    }

    /**
    * Prints node prompt to the console.
    */
    Print() 
    {
        console.log(this.prompt);
    }

    GetPrompt(): string
    {
        return this.prompt;
    }

    GetChoiceText(index: number): string|null
    {
        if (index >= this.branchCount || index < 0) return null;

        return this.branches[index].text;
    }

    /**
    * @param {number} branchNum Number representing which path to set.
    * @param {StoryNode} branch Branch to set as the destination of choice branchNum.
    */
    SetNext(branchNum: number, branch: Branch) 
    {
    if (branchNum < 0 || branchNum > this.branchCount) 
    {
        console.log("Bad branch number.");
        return;
    }

        this.branches[branchNum] = branch;
    }

    /**
    * @param {number} branchNum Number representing which path to get.
    * @returns {Branch} Branch at index branchNum in this node's branch choices.
    */
    GetNext(branchNum: number): Branch
    {
        return this.branches[branchNum];
    }
}

////
// Story Tree Implementation
////

// StoryTree
//    - nodes      : Array of StoryNodes, represents every node in the tree
//    - jsonIDHash : Hash table that turns ID from JSON to index in nodes array (ID 0 (root node) might be index 3)
//    - branchCount: Number of branches per node, how many choices the user gets

/**
* Story tree, contains reference to head of tree
* as well as its size, and is used to manipulate/navigate nodes.
*/
export class StoryTree
{
    // Array of all nodes
    private nodes: StoryNode[];
    // Hashmap of IDs (from JSON file) to indices in nodes array
    private jsonIDHash: IDtoIndex;
    // Branches per node
    private branchCount: number;

    /**
    * @returns {number} The number of branches each node possesses (edges per node)
    */
    GetBranchesPerNode(): number
    {
        return this.branchCount;
    }

    /**
    * @returns {StoryNode|null} The StoryNode with ID 0 (root), or null if one does not exist.
    */
    GetRootNode(): StoryNode|null
    {
        if (this.nodes[this.jsonIDHash[0]] == undefined) return null;

        return this.nodes[this.jsonIDHash[0]];
    }

    /**
    * Static method to populate a StoryTree object with data from a JSON file (with a specific format).
    * @param {StoryTreeJSON} data JSON file parsed into a StoryTreeJSON interface.
    * @returns {StoryTree} StoryTree object populated with data from the StoryTreeJSON arg.
    */
    static PopulateFromJSON(data: StoryTreeJSON): StoryTree
    {
        var NewStoryTree = new StoryTree();

        NewStoryTree.branchCount = data.branchCount;
        NewStoryTree.nodes = [];
        NewStoryTree.jsonIDHash = [];

        // Push every node from the JSON onto the nodes array,
        // and hash their IDs to indices in jsonIDHash
        for (let i = 0; i < data.tree.length; i++)
        {
            NewStoryTree.nodes.push(new StoryNode(data.tree[i].prompt, data.branchCount));
            NewStoryTree.jsonIDHash[data.tree[i].id] = i;
        }

        // Do a second pass, connecting nodes to each other
        // by adding Branches to their Branch arrays
        for (let i = 0; i < data.tree.length; i++)
        {
            // Get the IDs the current node should connect to
            let curBranches = data.tree[i].branches;
            for (let j = 0; j < curBranches.length; j++)
            {
                // Convert the current branch ID into an index in this.nodes
                curBranches[j] = NewStoryTree.jsonIDHash[curBranches[j]];
                // Format a new Branch to be added to the current node's Branch array
                let newBranch: Branch = { node: NewStoryTree.nodes[curBranches[j]], text: String(j + " Question") };
                NewStoryTree.nodes[i].SetNext(j, newBranch);
            }
        }

        return NewStoryTree;
    }
}

////
// Types and Interfaces
////

export type StoryTreeJSON = 
{
    branchCount: number;
    tree: 
    {
        id: number;
        branches: number[];
        prompt: string;
    }[];
}

interface IDtoIndex
{
    [key: number]: number;
}

type Branch = 
{
    node: StoryNode;
    text: string;  
}
