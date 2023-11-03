<script lang="ts">
    import { goto } from '$app/navigation';
    import { gameTree } from '../../tree_store.ts';

    interface ChoiceDict
    {
        [key: string]: number;
    }

    /// Story Tree Management ///
    let tree: StoryTree;
    gameTree.subscribe((value) => {
        console.log("Story tree read from store.")
        tree = value;
    });

    // let types = tree.types;
   
    let currentNode = tree.GetRootNode();

    // Prompt for choices
    let prompt: string
    UpdateCurrentPrompt();

    // Number of branches (typically the same for all, except leaf nodes which are 0)
    let numBranches = currentNode.GetNumBranches();
    // Choice text, to respond to prompt
    let choices: string[] = new Array(numBranches);
    UpdateChoices();

    // Type strings for buttons
    let buttonTypes: string = new Array(numBranches);
    UpdateColors();

    // Times the player took each type of choice
    let choicesTaken: ChoiceDict = [];
    ResetChoiceCount();
    
    function ResetChoiceCount()
    {
        for (let i = 0; i < tree.types.length; i++)
        {
            choicesTaken[tree.types[i]] = 0;
        }
        choicesTaken["TotalChoices"] = 0;
    }
       
    function UpdateChoices()
    {
        for (let i = 0; i < numBranches; i++)
        {
            choices[i] = currentNode.GetChoiceText(i);
        }
    }

    function UpdateColors()
    {
        for (let i = 0; i < numBranches; i++)
        {
            buttonTypes[i] = currentNode.GetType(i);
        }
    }

    function UpdateCurrentPrompt()
    {
        prompt = currentNode.GetPrompt();
    }

    function MoveToNext(index: number)
    {
        if (index < 0 || index >= numBranches) return;

        currentNode = currentNode.GetNext(index).node;
    }

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

    function RestartGame()
    {
        console.log(choicesTaken);
        ResetChoiceCount();
        currentNode = tree.GetRootNode();
        numBranches = currentNode.GetNumBranches();
        UpdateCurrentPrompt();
        UpdateChoices();
        UpdateColors();
        console.log("Game reset, node changed to: ID " + currentNode.GetID() + ".");
    }
    ///////////////
    
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
        /*padding: 10px;*/
        font-size: 4vmin;
        font-family: "FreeMono", "Lucida Console", monospace;
        border-radius: 8px;
        border: 16px solid #d9dadb;
        overflow-wrap: break-word;
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

    .menu-button {
        position: absolute;
        font-size: 1.5vmin;
        height: 5%;
        width: 8%;
        top: 2%;
        left: 99%;
        transform:translate(-99%, -2%);
    }

    .button {
        color: black;
        width: 100%; /* use whole width of flex box*/
        height: 33vh;/* use 1/3 of screen per button */
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 2vmin;
        font-family: "FreeMono", "Lucida Console", monospace;
        transition-duration: 0.4s;
        border-radius: 8px;
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
        margin-left: 5%;
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .button:hover {
        font-size: 2.5vmin;
    }

    .static-box {
        color: black;
        width: 100%; /* use whole width of flex box*/
        height: 33vh;/* use 1/3 of screen per button */
        text-decoration: none;
        font-size: 2vmin;
        font-family: "FreeMono", "Lucida Console", monospace;
        border-radius: 8px;
        background-color: #d7d9db;
        margin-left: 5%;
        margin-top: 1%;
        margin-bottom: 1%;
        overflow-wrap: break-word;
    }

    .game-stats-box {
        color: black;
        width: 100%; /* use whole width of flex box*/
        height: 33vh;/* use 1/3 of screen per button */
        text-decoration: none;
        font-size: 2vmin;
        font-family: "FreeMono", "Lucida Console", monospace;
        border-radius: 8px;
        flex-direction: column;
        border-radius: 0px;
        overflow-wrap: break-word;
    }

    .game-stats {
        color: black;
        text-align: center;
        font-size: 2vmin;
        font-family: "FreeMono", "Lucidia Console", monospace;
    }
</style>

<body>
    <button
        class="menu-button Interaction"
        on:click={() => BackToMenu()}
    >Return to Menu</button>
    
    <prompt-container>
        <p>Prompt: {prompt}</p>
    </prompt-container>

    <flex-container>
        {#if numBranches > 0}
            {#each currentNode.branches as branch, i}
                <button
                    class="button"
                    style="background-color: {tree.typeToColor[buttonTypes[i]]}; border: 3px solid {tree.typeToBorderColor[buttonTypes[i]]};"
                    on:click={() => UpdateGame(i)}
                >{choices[i]}</button>
            {/each}
        {:else}
            <div class="flex-button">
            <button
                class="button Interaction"
                on:click={() => RestartGame()}
            >Restart the game!</button>
            </div>
            <div class="static-box">
                <sub-flex-container>
                    {#each tree.types as type, i}
                        <div 
                        class="game-stats-box" 
                        style="border: 3px solid {tree.typeToBorderColor[type]}; background-color: {tree.typeToColor[type]};">
                            <p class="game-stats">{tree.types[i]}</p>
                            <p class="game-stats" style="padding-top: 20%; font-size: 4vmin">{choicesTaken[type]}</p>
                            <p class="game-stats" style="padding-top: 20%; font-size: 4vmin">{choicesTaken[type] / choicesTaken['TotalChoices'] * 100}%</p>
                        </div>
                    {/each}
                </sub-flex-container>
            </div> 
        {/if}
    </flex-container>
</body>
