<script lang="ts">
    import { goto } from '$app/navigation';
    import { gameTree } from '../../tree_store.ts';

    let tree: StoryTree;
    gameTree.subscribe((value) => {
        console.log("bruh");
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
        console.log(tree.GetNodes());
        MoveToNext(choice);
        numBranches = currentNode.GetNumBranches();
        UpdateCurrentPrompt();
        UpdateChoices();
        UpdateColors();
        console.log("Node change to: ID " + currentNode.GetID());
    }

    function RestartGame()
    {
        currentNode = tree.GetRootNode();
        numBranches = currentNode.GetNumBranches();
        UpdateCurrentPrompt();
        UpdateChoices();
        UpdateColors();
        console.log("Game reset, node changed to: ID " + currentNode.GetID());
    }

    function BackToMenu()
    {
        RestartGame();
        goto('..', { replaceState: false });
    }
</script>

<style>
    .prompt-container {
        background-color: #d7d9db;
        position: absolute;
        height: 80%;
        width: 50%;
        top: 50%;
        left: 85%;
        transform:translate(-85%, -50%);
        padding: 10px;
        font-size: 32px;
        font-family: "FreeMono", "Lucida Console", monospace;
        border-radius: 8px;
        border: 4px solid #292c33
    }

    .menu-button {
        position: absolute;
        height: 5%;
        width: 8%;
        top: 2%;
        left: 99%;
        transform:translate(-99%, -2%);
    }

    .flex-container {
        height: 100vh;
        width: 33vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around
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
        background-color: #ffd299
    }

    .Interaction:hover {
        background-color: #ffffff
    }
</style>

<body>
    <button
        class="menu-button Interaction"
        on:click={() => BackToMenu()}
    >Return to Menu</button>
    
    <div class="prompt-container">
        <p style="font-size:32px;">Prompt: {prompt}</p>
    </div>

    <div class="flex-container">
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
        {/if}
    </div>
</body>
