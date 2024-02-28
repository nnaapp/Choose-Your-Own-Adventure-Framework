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
    private nodes: StoryNode[][];
    // Hashmap of IDs (from JSON file) to indices in nodes array
    private jsonIDHash: IDtoIndex[];
    // Array of choice type names
    public types: string[];
    // Colors for background image
    public backgroundColors: string[];
    // Color for background color dependent elements (menu buttons)
    public menuColor: string;
    // Color for accents (text, etc) on menu elements
    public accentColor: string;
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
        this.jsonIDHash = [];
        this.types = [];
        this.backgroundColors = [];
        this.menuColor = "";
        this.accentColor = "";
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
    GetRootNode(treeIndex: number): StoryNode|null
    {
        if (this.nodes[treeIndex][this.jsonIDHash[treeIndex][0]] == undefined) return null;

        return this.nodes[treeIndex][this.jsonIDHash[treeIndex][0]];
    }

    GetNodes(treeIndex: number): StoryNode[]
    {
        return this.nodes[treeIndex];
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
        NewStoryTree.fonts = data.Fonts;
        NewStoryTree.backgroundColors = data.BackgroundColors;
        if (NewStoryTree.backgroundColors.length < 2)
        {
            NewStoryTree.backgroundColors = ["#000000", "#000000"];
        }
        NewStoryTree.menuColor = data.MenuColor;
        NewStoryTree.accentColor = data.AccentColor;

        // If there is a mismatch between the number of choice types, and the number of colors, return null
        if (data.Types.length != data.Colors.length) return null;
        // Fill out the hashmap from type names to color codes
        for (let i = 0; i < data.Types.length; i++)
        {
            NewStoryTree.types[i] = data.Types[i];
            NewStoryTree.typeToColor[data.Types[i]] = data.Colors[i];
            NewStoryTree.typeToBorderColor[data.Types[i]] = data.BorderColors[i];
        }


        // Push every node from the JSON onto the nodes array,
        // and hash their IDs to indices in jsonIDHash
        data.Trees.forEach((tree, treeIndex) => {
            NewStoryTree.nodes.push(new Array<StoryNode>());
            NewStoryTree.jsonIDHash.push({} as IDtoIndex);
            tree.Tree.forEach((node, nodeIndex) => {
                NewStoryTree.nodes[treeIndex].push(new StoryNode(nodeIndex, node.Prompt, node.Branches.length));
                NewStoryTree.jsonIDHash[treeIndex][node.ID] = nodeIndex;
            });
        });

        // Do a second pass, connecting nodes to each other
        // by adding Branches to their Branch arrays
        data.Trees.forEach((tree, treeIndex) => {
            tree.Tree.forEach((node, nodeIndex) => {
                // Get the IDs the current node should connect to
                let curBranches = node.Branches;
                // Get the types of the current set of branches (cost, consequences, etc)
                let curTypes = node.Types;
                let curTexts = node.Texts;

                curBranches.forEach((branch, branchIndex) => {
                    // Convert the current branch ID into an index in this.nodes
                    branch = NewStoryTree.jsonIDHash[treeIndex][branch];

                    // Format a new Branch to be added to the current node's Branch array
                    let newBranch: Branch = { node: NewStoryTree.nodes[treeIndex][branch], 
                        nodeType: curTypes[branchIndex], text: curTexts[branchIndex] };

                    NewStoryTree.nodes[treeIndex][nodeIndex].SetNext(branchIndex, newBranch);
                });
            });
        });

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
    BackgroundColors: string[];
    MenuColor: string;
    AccentColor: string;
    Types: string[];
    Colors: string[];
    HoverColors: string[];
    BorderColors: string[];
    BranchCount: number;
    Trees: 
    {
        Tree:
        {
            ID: number;
            Branches: number[];
            Types: string[];
            Texts: string[];
            Prompt: string;
        }[]
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
