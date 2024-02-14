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
            document.getElementById("Sidebar").style.right = "0rem";
            document.getElementById("Burger-Mid").style.opacity = "0";
            document.getElementById("Burger-Top").style.transform = "rotate(45deg) translate(0px, 14px)"
            document.getElementById("Burger-Low").style.transform = "rotate(-45deg) translate(0px, -14px)"
            sidebarOn = true;
        }
        else
        {
            document.getElementById("Sidebar").style.right = "-16rem";
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

<style lang="postcss">
    .sidebar {
        background-image: linear-gradient(var(--sidebarColor1), var(--sidebarColor2));
        filter: brightness(1.2); 
        transition: right 0.5s;
    }
    
    .btn-sidebar {
        font: inherit;
        color: var(--textColor);
        background-color: var(--buttonColor);
        transition: filter 0.5s;
    }

    .btn-sidebar:hover {
        filter: brightness(1.1);
    }

    .burger-line {
        background-color: var(--textColor);
    }
</style>

<body style="--primaryFont: {tree.fonts[0]}; 
    --secondaryFont: {tree.fonts[1]}; 
    --tertiaryFont: {tree.fonts[2]}; 
    --bkgColor1: {tree.backgroundColors[0]}; 
    --bkgColor2: {tree.backgroundColors[1]}; 
    --textColor: {tree.accentColor};"
>
    <!-- Side bar menu -->
    <div id="Sidebar" class="sidebar h-full w-64 -right-64 pt-14 z-10 fixed overflow-hidden"
        style="--buttonColor: {tree.menuColor}; 
        --sidebarColor1: {tree.backgroundColors[0]}; 
        --sidebarColor2: {tree.backgroundColors[1]};"
    >
        <button 
        class="btn-sidebar w-full h-10 text-xl  mt-1.5 border-none relative"
        on:click={() => BackToMenu()}
        >Menu</button>

        <button 
        class="btn-sidebar w-full h-10 text-xl  mt-1.5 border-none relative"
        on:click={() => RestartGame()}
        >Restart</button>
    </div>

    <!-- Burger icon (3 lines) for opening side bar -->
    <button 
    id="Burger"
    class="h-8 w-14 z-20 relative float-right duration-500 flex flex-col items-center justify-center"
    on:click={() => ToggleSidebar()}>
        <div id="Burger-Top" class="burger-line w-8 h-1 mt-1.5 block duration-500"></div>
        <div id="Burger-Mid" class="burger-line w-8 h-1 mt-1.5 block duration-150"></div>
        <div id="Burger-Low" class="burger-line w-8 h-1 mt-1.5 block duration-500"></div>
    </button>
    
    <!-- Prompt box on right half of screen -->
    <div class="h-screen w-1/2 float-right flex items-center justify-start">
        <div class="h-5/6 w-5/6 text-3xl bg-slate-100 border-slate-100 border-8 rounded-lg flex items-center justify-center">
            <p class="m-auto">{prompt}</p>
        </div>
    </div>

    <!-- Vertical flexbox to support any number of buttons stacked on top of each other -->
    <div class="h-screen w-1/3 flex flex-col items-center justify-center">
        <!-- If this is not a leaf node, use an #each block to render one button per branch in the branch array -->
        {#if numBranches > 0}
            {#each currentNode.branches as branch, i}
                <button
                    class="w-5/6 h-1/3 text-center inline-block text-xl duration-300 rounded-lg m-5 
                    hover:scale-105 active:duration-200 active:scale-100"
                    style="font-family: inherit; background-color: {tree.typeToColor[buttonTypes[i]]}; 
                    border: 3px solid {tree.typeToBorderColor[buttonTypes[i]]};"
                    on:click={() => UpdateGame(i)}
                >{choices[i]}</button>
            {/each}
        <!-- If this is a leaf node, render a restart game button, as well as post-game stats -->
        {:else}
            <button
                class="w-5/6 h-1/3 bg-white text-center inline-block text-2xl duration-300 rounded-lg m-5 
                hover:scale-105 active:duration-200 active:scale-100"
                on:click={() => RestartGame()}
            >Restart the game!</button>
            <!-- Render post-game stats in a secondary horizontal flexbox, colored to reflect the colors of each type -->
            <div class="w-5/6 h-1/3 text-xl rounded-lg bg-slate-300">
                <div class="h-full w-full flex justify-around">
                    {#each tree.types as type, i}
                        <div class="w-full h-full text-xl flex flex-col justify-around"
                        style="background-color: {tree.typeToColor[type]}; border: 3px solid {tree.typeToBorderColor[type]};">
                            <p class="text-center text-xl">{tree.types[i]}</p>
                            <p class="text-center text-2xl duration-500 hover:scale-125">{choicesTaken[type]}</p>
                            <p class="text-center text-2xl duration-500 hover:scale-125">{choicesTaken[type] / choicesTaken['TotalChoices'] * 100}%</p>
                        </div>
                    {/each}
                </div>
            </div> 
        {/if}
    </div>
</body>
