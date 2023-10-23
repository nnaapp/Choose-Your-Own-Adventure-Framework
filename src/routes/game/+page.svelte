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
   
    let currentNode = tree.GetRootNode();

    let prompt: string
    UpdateCurrentPrompt();
    
    let numBranches = currentNode.GetNumBranches();
    let choices: string[] = new Array(numBranches);
    UpdateChoices();

    let buttonTypes: string = new Array(numBranches);
    UpdateColors();

    // Times the player took each type of choice
    let choicesTaken: ChoiceDict = [];
    ResetChoiceCount();
    
    function ResetChoiceCount()
    {
        choicesTaken["Cost"] = 0;
        choicesTaken["Time"] = 0;
        choicesTaken["Consequences"] = 0;
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
        if (choicesTaken[buttonTypes[choice]] == undefined)
        {
            choicesTaken[buttonTypes[choice]] = 1;        
        }
        else
        {
            choicesTaken[buttonTypes[choice]]++;
        }
    
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
        background-color: #d7d9db;
        position: absolute;
        height: 80%;
        width: 50%;
        top: 50%;
        left: 85%;
        transform:translate(-85%, -50%);
        padding: 10px;
        font-size: 4vmin;
        font-family: "FreeMono", "Lucida Console", monospace;
        border-radius: 8px;
        border: 4px solid #292c33
    }

    flex-container {
        height: 100vh;
        width: 33vw;
        display: flex;
        flex-direction: column;
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

    .flex-button {
        margin-bottom: 3%; /* evil hack to center the flex box buttons, magic number */
        margin-left: 5%;
    }

    .button {
        color: black;
        width: 100%; /* use whole width of flex box*/
        height: 33vh;/* use 1/3 of screen per button */
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-family: "FreeMono", "Lucida Console", monospace;
        transition-duration: 0.4s;
        border-radius: 8px;
        white-space: normal;
        word-wrap: break-word;
    }

    .Cost {
        background-color: #4A86E8;
        border: 3px solid #3b72cc;
    }

    .Time {
        background-color: #93C47D;
        border: 3px solid #79a863;
    }

    .Consequences {
        background-color: #FFAB40;
        border: 3px solid #d98c2b;
    }

    .Interaction {
        background-color: #d7d9db;
        border: 3px solid #292c33;
    }

    .Cost:hover {
        background-color: #96beff;
    }

    .Time:hover {
        background-color: #daffc9;
    }

    .Consequences:hover {
        background-color: #ffd299;
    }

    .Interaction:hover {
        background-color: #ffffff;
    }

    .static {
        color: black;
        width: 100%; /* use whole width of flex box*/
        height: 33vh;/* use 1/3 of screen per button */
        text-decoration: none;
        font-size: 2vmin;
        font-family: "FreeMono", "Lucida Console", monospace;
        border-radius: 8px;
        background-color: #d7d9db 
    }
</style>

<body>
    <button
        class="menu-button Interaction"
        on:click={() => BackToMenu()}
    >Return to Menu</button>
    
    <prompt-container>
        <p style="font-size:32px;">Prompt: {prompt}</p>
    </prompt-container>

    <flex-container>
        {#if numBranches > 0}
            {#each currentNode.branches as branch, i}
                <div class="flex-button">
                <button
                    class="button {buttonTypes[i]}" 
                    on:click={() => UpdateGame(i)}
                >{choices[i]}</button>
                </div>
            {/each}
        {:else}
            <div class="flex-button">
            <button
                class="button Interaction"
                on:click={() => RestartGame()}
            >Restart the game!</button>
            </div>
            <div class="flex-button">
            <div class="static">
            <div style="position: relative; top: 50%; transform:translateY(-50%);">
            <div style="position: relative; left: 10%; transform:translateX(-10%); display: inline-block; text-align: left;">
                <p style="margin-bottom: 8vh; text-decoration: underline;">Types of Choices Picked</p>
                <p style="white-space: pre; margin-bottom: 4vh">Cost&#9;&#9;{choicesTaken["Cost"]}</p>
                <p style="white-space: pre; margin-bottom: 4vh">Time&#9;&#9;{choicesTaken["Time"]}</p>
                <p style="white-space: pre;">Consequences&#9;{choicesTaken["Consequences"]}</p>
            </div>
            </div>
            </div>
            </div>        
        {/if}
    </flex-container>
</body>
