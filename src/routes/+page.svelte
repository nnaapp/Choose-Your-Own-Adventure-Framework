<script lang="ts">
    import { StoryTree, StoryNode } from './tree.ts'
    import type { StoryTreeJSON } from './tree.ts'
    import * as data from './convertedlong.json'

    let tree: StoryTree = StoryTree.PopulateFromJSON(data as StoryTreeJSON);

    let currentNode: StoryNode = tree.GetRootNode();

    let prompt: string
    UpdateCurrentPrompt();
    
    let numBranches = tree.GetBranchesPerNode();
    let choices: string[] = new Array(numBranches);
    UpdateChoices();
        
    function UpdateChoices()
    {
        for (let i = 0; i < numBranches; i++)
        {
            choices[i] = currentNode.GetChoiceText(i);
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
        console.log("Node change to: ID " + currentNode.GetID());
    }
</script>

<style>
    .question-container {
        background-color: #ced7de;
        position: absolute;
        top: 10%;
        left: 40%;
        height: 80%;
        width: 50%;
        padding: 10px;
        font-size: 32px;
        font-family: "FreeMono", "Lucida Console", monospace;
    }

    .flex-container {
        height: 100vh;
        width: 33vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around
    }

    .flex-button {
        margin-bottom: 2%;
        margin-left: 5%;
    }

    .button {
        background-color: #79ed79;
        border: 2px solid #78e378;
        color: black;
        padding: 75px 200px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-family: "FreeMono", "Lucida Console", monospace;
        transition-duration: 0.4s;
        border-radius: 8px;
    }

    .button:hover {
        background-color: #dbffdb;
        border: 2px solid #bce8bc;
        color: black;
    }
</style>

<body style="background-color:#ebebeb;">
    <div class="question-container">
        <p style="font-size:32px;">Prompt: {prompt}</p>
    </div>

    <div class="flex-container">
        {#each currentNode.branches as branches, i}
            <div class="flex-button">
            <button
                class = "button" 
                on:click={() => UpdateView(i)}
            >{choices[i]}</button>
            </div>
        {/each}
    </div>
</body>
