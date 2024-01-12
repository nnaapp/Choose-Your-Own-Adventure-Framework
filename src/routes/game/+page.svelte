<script lang="ts">
    import { goto } from '$app/navigation';
    import { gameTree } from '../../tree_store.ts';

    // Interfact dictionary that associates a string with a number,
    // this is used for keeping track of how many times the user has picked each choice type
    interface ChoiceDict
    {
        [key: string]: number;
    }

    // Get a reference to the story tree Svelte store, which prevents regenerating it on every refresh
    let tree: StoryTree;
    gameTree.subscribe((value) => {
        console.log("Story tree read from store.")
        tree = value;
    });

    // Get reference to root node of story tree
    let currentNode = tree.GetRootNode();

    // Prompt for choices
    let prompt: string
    UpdateCurrentPrompt();

    // Number of branches (typically the same for all, except leaf nodes which are 0)
    let numBranches = currentNode.GetNumBranches();
    
    // Choice text, to respond to prompt, this array is ordered
    let choices: string[] = new Array(numBranches);
    UpdateChoices();

    // Type strings for each choice, these are defined in the JSON file for every node in the tree
    let buttonTypes: string[] = new Array(numBranches);
    UpdateColors();

    // Number of times the player picked each choice type, which are defined in the JSON file
    let choicesTaken: ChoiceDict = [];
    ResetChoiceCount();

    // Resets the choice counts to 0 for the entire dictionary
    function ResetChoiceCount()
    {
        for (let i = 0; i < tree.types.length; i++)
        {
            choicesTaken[tree.types[i]] = 0;
        }
        choicesTaken["TotalChoices"] = 0;
    }

    // Updates the choice text array to reflect the current node
    function UpdateChoices()
    {
        for (let i = 0; i < numBranches; i++)
        {
            choices[i] = currentNode.GetChoiceText(i);
        }
    }

    // Update the current button type array to reflect the current node
    // This is used to color the buttons correctly, as well as count choice types
    function UpdateColors()
    {
        for (let i = 0; i < numBranches; i++)
        {
            buttonTypes[i] = currentNode.GetType(i);
        }
    }

    // Updates the story prompt to reflect the current node
    function UpdateCurrentPrompt()
    {
        prompt = currentNode.GetPrompt();
    }

    // Move to the next node, number argument selects which choice to take (0...n - 1, where n is number of choices per node)
    function MoveToNext(index: number)
    {
        if (index < 0 || index >= numBranches) return;

        currentNode = currentNode.GetNext(index).node;
    }

    // Updates all necessary data after moving to the node the user picked, and increments the choice count for that choice type
    function UpdateGame(choice: number)
    {
        choicesTaken[buttonTypes[choice]]++;
        choicesTaken["TotalChoices"]++;
    
        MoveToNext(choice);
        numBranches = currentNode.GetNumBranches();
        UpdateCurrentPrompt();
        UpdateChoices();
        UpdateColors();
        console.log("Node change to: ID " + currentNode.GetID() + ".");
    }

    // Resets the game by setting current node to the root of the tree, then updating all necessary data, and resetting choice type counts
    function RestartGame()
    {
        console.log(choicesTaken);
        ResetChoiceCount();
        currentNode = tree.GetRootNode();
        numBranches = currentNode.GetNumBranches();
        UpdateCurrentPrompt();
        UpdateChoices();
        UpdateColors();
        if (sidebarOn) ToggleSidebar();
        console.log("Game reset, node changed to: ID " + currentNode.GetID() + ".");
    }

    // State of side bar 
    let sidebarOn: boolean = false;
    // Changes CSS values to toggle the side bar menu on and off
    function ToggleSidebar()
    {
        if (!sidebarOn)
        {
            document.getElementById("Sidebar").style.right = "0px";
            document.getElementById("Burger-Mid").style.opacity = "0";
            document.getElementById("Burger-Top").style.transform = "rotate(45deg) translate(6px, 6px)"
            document.getElementById("Burger-Low").style.transform = "rotate(135deg) translate(-5px, 5px)"
            sidebarOn = true;
        }
        else
        {
            document.getElementById("Sidebar").style.right = "-250px";
            document.getElementById("Burger-Mid").style.opacity = "100";
            document.getElementById("Burger-Top").style.transform = "rotate(0deg)"
            document.getElementById("Burger-Low").style.transform = "rotate(0deg)"
            sidebarOn = false;
        }
    }

    // Uses Svelte goto to return to the menu page
    function BackToMenu()
    {
        goto('..', { replaceState: false });
    }
</script>

<style>
    prompt-container {
        background-color: #d9dadb;
        position: absolute;
        height: 80%;
        width: 50%;
        top: 50%;
        left: 85%;
        transform:translate(-85%, -50%);
        font-size: 4vmin;
        border-radius: 8px;
        border: 16px solid #d9dadb;
        display: flex;
    }

    flex-container {
        height: 100vh;
        width: 33vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    sub-flex-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .button {
        width: 100%;
        height: 33%;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 3vmin;
        font-family: inherit;
        transition: transform 0.4s;
        border-radius: 8px;
        white-space: normal;
        margin-left: 5%;
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .button:hover {
        transform: scale(1.05);
    }

    .button:active {
        transition: transform 0.2s;
        transform: scale(1);
    }

    static-box {
        width: 100%;
        height: 33%;
        text-decoration: none;
        font-size: 2vmin;
        border-radius: 8px;
        background-color: #d7d9db;
        margin-left: 5%;
        margin-top: 1%;
        margin-bottom: 1%;
    }

    game-stats-box {
        width: 100%; 
        height: 33vh;
        text-decoration: none;
        font-size: 2vmin;
        border-radius: 8px;
        flex-direction: column;
        border-radius: 0px;
    }

    /* style for paragraph in postgame stats */
    .game-stats-header {
        text-align: center;
        font-size: 2vmin;
    }

    .game-stats {
        text-align: center;
        font-size: 4vmin;
        padding-top: 20%;
        transition: transform 0.5s;
    }

    .game-stats:hover {
        transform: scale(1.2);
    }

    sidebar {
        height: 100%;
        width: 250px;
        position: fixed;
        z-index: 1;
        top: 0;
        right: -250px;
        background-image: linear-gradient(var(--sidebarColor1), var(--sidebarColor2));
        filter: brightness(1.2); 
        overflow: hidden;
        padding-top: 60px;
        transition: right 0.5s;
    }
    
    .sidebar-button {
        font-size: 1.5vmin;
        font: inherit;
        position: relative;
        left: 50%;
        transform:translate(-50%, 0%);
        height: 40px;
        width: 100%;
        color: var(--textColor);
        background-color: var(--buttonColor);
        font-size: 12px;
        transition: filter 0.5s;
        border: none;
        margin-top: 5px;
    }

    .sidebar-button:hover {
        filter: brightness(1.5);
    }

    .burger {
        all: unset;
        width: 50px;
        height: 30px;
        position: absolute;
        left: 100%;
        top: 1%;
        transform:translate(-100%, -1%);
        background: rgba(0,0,0,0);
        z-index: 1;
        transition: transform 0.5s;
    }

    .burger:focus {
        outline: revert;
    }

    burger-line {
        width: 25px;
        height: 3px;
        background-color: var(--textColor);
        margin: 5px;
        display: block;
        right: 90%;
        transition: transform 0.5s;
    }
</style>

<body style="--primary: {tree.fonts[0]}; --secondary: {tree.fonts[1]}; --tertiary: {tree.fonts[2]}; 
    --bkgColor1: {tree.backgroundColors[0]}; --bkgColor2: {tree.backgroundColors[1]}; --textColor: {tree.accentColor};">
    <!-- Side bar menu -->
    <sidebar id="Sidebar" style="--buttonColor: {tree.menuColor}; --sidebarColor1: {tree.backgroundColors[0]}; --sidebarColor2: {tree.backgroundColors[1]};">
        <button 
        class="sidebar-button"
        on:click={() => BackToMenu()}>Menu</button>
        <button 
        class="sidebar-button"
        on:click={() => RestartGame()}>Restart</button>
    </sidebar>

    <!-- Burger icon (3 lines) for opening side bar -->
    <button 
    id="Burger"
    class="burger"
    on:click={() => ToggleSidebar()}>
        <burger-line id="Burger-Top"></burger-line>
        <burger-line id="Burger-Mid" style="transition: opacity 0.25s"></burger-line>
        <burger-line id="Burger-Low"></burger-line>
    </button>
    
    <!-- Prompt box on right half of screen -->
    <prompt-container>
        <p style="margin: auto;">{prompt}</p>
    </prompt-container>

    <!-- Vertical flexbox to support any number of buttons stacked on top of each other -->
    <flex-container>
        <!-- If this is not a leaf node, use an #each block to render one button per branch in the branch array -->
        {#if numBranches > 0}
            {#each currentNode.branches as branch, i}
                <button
                    class="button"
                    style="background-color: {tree.typeToColor[buttonTypes[i]]}; border: 3px solid {tree.typeToBorderColor[buttonTypes[i]]};"
                    on:click={() => UpdateGame(i)}
                >{choices[i]}</button>
            {/each}
        <!-- If this is a leaf node, render a restart game button, as well as post-game stats -->
        {:else}
            <button
                class="button Interaction"
                on:click={() => RestartGame()}
            >Restart the game!</button>
            <!-- Render post-game stats in a secondary horizontal flexbox, colored to reflect the colors of each type -->
            <static-box>
                <sub-flex-container>
                    {#each tree.types as type, i}
                        <game-stats-box
                        style="background-color: {tree.typeToColor[type]}; border: 3px solid {tree.typeToBorderColor[type]};">
                            <p class="game-stats-header">{tree.types[i]}</p>
                            <p class="game-stats">{choicesTaken[type]}</p>
                            <p class="game-stats">{choicesTaken[type] / choicesTaken['TotalChoices'] * 100}%</p>
                        </game-stats-box>
                    {/each}
                </sub-flex-container>
            </static-box> 
        {/if}
    </flex-container>
</body>
