<script lang="ts">
    import { StoryTree, StoryNode } from './tree.ts'
    import type { StoryTreeJSON } from './tree.ts'
    import * as data from './convertedstory2.json'

    let tree: StoryTree = StoryTree.PopulateFromJSON(data as StoryTreeJSON);

    let currentNode: StoryNode = tree.GetRootNode();

    let prompt: string
    UpdateCurrentPrompt();
    
    let numBranches = tree.GetBranchesPerNode();
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
            console.log(buttonTypes[i]);
        }
    }

    function UpdateCurrentPrompt()
    {
        prompt = currentNode.GetPrompt();
    }

    function MoveToNext(index: number)
    {
        if (index < 0 || index >= tree.GetBranchesPerNode()) return;

        currentNode = currentNode.GetNext(index).node;
    }

    function UpdateView(choice: number)
    {
        MoveToNext(choice);
        UpdateCurrentPrompt();
        UpdateChoices();
        UpdateColors();
        console.log("Node change to: ID " + currentNode.GetID());
    }
</script>

<style>
    .question-container {
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

    .Cost:hover {
        background-color: #96beff;
    }

    .Time:hover {
        background-color: #daffc9;
    }

    .Consequences:hover {
        background-color: #ffd299
    }
</style>

<body style="background-image: linear-gradient(#252e3d, #0D1117);">
    <div class="question-container">
        <p style="font-size:32px;">Prompt: {prompt}</p>
    </div>

    <div class="flex-container">
        {#each currentNode.branches as branches, i}
            <div class="flex-button">
            <button
                class = "button {buttonTypes[i]}" 
                on:click={() => UpdateView(i)}
            >{choices[i]}</button>
            </div>
        {/each}
    </div>
</body>
