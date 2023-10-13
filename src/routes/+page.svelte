<script lang="ts">
    import { StoryTree, StoryNode } from './tree.ts'
    import type { StoryTreeJSON } from './tree.ts'
    import * as data from './convertedlong.json'

    let tree: StoryTree = StoryTree.PopulateFromJSON(data as StoryTreeJSON);

    let currentNode: StoryNode = tree.GetRootNode();

    let prompt: string = currentNode.GetPrompt();
    
    function GetCurrentChoice(index: number): string|null
    {
        if (index < 0 || index >= tree.GetBranchesPerNode()) return null;

        return currentNode.GetChoiceText(index);
    }

    function UpdateCurrentPrompt(): string
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
        console.log("Node change to: ID " + currentNode.GetID());
    }
</script>

<div>
    <p>Prompt: {prompt}</p>

    {#each currentNode.branches as branches, i}
        <button
            on:click={() => UpdateView(i)}
        >{GetCurrentChoice(i)}</button>
    {/each}
</div>
