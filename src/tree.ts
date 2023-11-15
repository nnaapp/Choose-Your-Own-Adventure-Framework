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
    // ID from JSON file
    private ID: number;

    /**
    * @param {string} prompt Prompt, defaults to "".
    * @param {number} branchCount Number of branches, defaults to 2.
    */
    constructor(ID: number, prompt: string, branchCount: number) 
    {
        this.ID = ID;
        this.prompt = prompt;
        this.branchCount = branchCount;
        this.branches = new Array(this.branchCount);
    }

    /**
    * @returns {string} Prompt associated with this node
    */
    GetPrompt(): string
    {
        return this.prompt;
    }

    /**
    * @param {number} index Index of branch to get the text of (0 would be option 1, and so on)
    * @returns {string|null} The text of the requested branch
    */
    GetChoiceText(index: number): string|null
    {
        if (index >= this.branchCount || index < 0) return null;

        return this.branches[index].text;
    }

    GetType(index: number): string|null
    {
        if (index >= this.branchCount || index < 0) return null;

        return this.branches[index].nodeType;
    }

    /**
    * @returns {number} ID from JSON file for this node (unique identifier)
    */
    GetID(): number
    {
        return this.ID;
    }

    GetNumBranches(): number
    {
        return this.branchCount;
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
    // Array of choice type names
    public types: string[];
    // Menu screen title
    public title: string;
    // Menu screen title subtext (second line)
    public titleSubtext: string;
    // Hashmap of type names to color codes (Cost: #FFFFFF, for example)
    public typeToColor: TypeToColor;
    public typeToHoverColor: TypeToColor;
    public typeToBorderColor: TypeToColor;
    // Array of fonts for webpage
    public fonts: string[];
    // Branches per node
    public branchCount: number;

    /**
    * Fills out an empty StoryTree, as StoryTree is meant to be
    * populated from a JSON file (example included in github)
    */
    constructor()
    {
        this.nodes = [];
        this.jsonIDHash = {};
        this.types = [];
        this.title = "";
        this.titleSubtext = "";
        this.typeToColor = {};
        this.typeToHoverColor = {};
        this.typeToBorderColor = {};
        this.fonts = [];
        this.branchCount = 0;
    }

    /**
    * @returns {StoryNode|null} The StoryNode with ID 0 (root), or null if one does not exist.
    */
    GetRootNode(): StoryNode|null
    {
        if (this.nodes[this.jsonIDHash[0]] == undefined) return null;

        return this.nodes[this.jsonIDHash[0]];
    }

    GetNodes(): StoryNode[]
    {
        return this.nodes;
    }

    /**
    * Static method to populate a StoryTree object with data from a JSON file (with a specific format).
    * @param {StoryTreeJSON} data JSON file parsed into a StoryTreeJSON interface.
    * @returns {StoryTree} StoryTree object populated with data from the StoryTreeJSON arg.
    */
    static PopulateFromJSON(data: StoryTreeJSON): StoryTree|null
    {
        var NewStoryTree = new StoryTree();

        NewStoryTree.branchCount = data.BranchCount;
        NewStoryTree.title = data.Title;
        NewStoryTree.titleSubtext = data.TitleSubtext;

        // If there is a mismatch between the number of choice types, and the number of colors, return null
        if (data.Types.length != data.Colors.length) return null;
        // Fill out the hashmap from type names to color codes
        for (let i = 0; i < data.Types.length; i++)
        {
            NewStoryTree.types[i] = data.Types[i];
            NewStoryTree.typeToColor[data.Types[i]] = data.Colors[i];
            NewStoryTree.typeToHoverColor[data.Types[i]] = data.HoverColors[i];
            NewStoryTree.typeToBorderColor[data.Types[i]] = data.BorderColors[i];
            NewStoryTree.fonts = data.Fonts;
        }

        // Push every node from the JSON onto the nodes array,
        // and hash their IDs to indices in jsonIDHash
        for (let i = 0; i < data.Tree.length; i++)
        {
            NewStoryTree.nodes.push(new StoryNode(i, data.Tree[i].Prompt, data.Tree[i].Branches.length));
            NewStoryTree.jsonIDHash[data.Tree[i].ID] = i;
        }

        // Do a second pass, connecting nodes to each other
        // by adding Branches to their Branch arrays
        for (let i = 0; i < data.Tree.length; i++)
        {
            // Get the IDs the current node should connect to
            let curBranches = data.Tree[i].Branches;
            // Get the types of the current set of branches (cost, consequences, etc)
            let curTypes = data.Tree[i].Types;
            let curTexts = data.Tree[i].Texts;
            for (let j = 0; j < curBranches.length; j++)
            {
                // Convert the current branch ID into an index in this.nodes
                curBranches[j] = NewStoryTree.jsonIDHash[curBranches[j]];
                // Format a new Branch to be added to the current node's Branch array
                let newBranch: Branch = 
                    { node: NewStoryTree.nodes[curBranches[j]], nodeType: curTypes[j], text: curTexts[j] };
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
    Title: string;
    TitleSubtext: string;
    Fonts: string[];
    Types: string[];
    Colors: string[];
    HoverColors: string[];
    BorderColors: string[];
    BranchCount: number;
    Tree: 
    {
        ID: number;
        Branches: number[];
        Types: string[];
        Texts: string[];
        Prompt: string;
    }[];
}

interface IDtoIndex
{
    [key: number]: number;
}

interface TypeToColor
{
    [key: string]: string;
}

export type Branch = 
{
    node: StoryNode;
    nodeType: string;
    text: string;  
}
