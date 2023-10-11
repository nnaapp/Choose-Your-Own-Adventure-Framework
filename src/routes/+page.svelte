<script lang="ts">
    import { StoryTree, StoryNode } from './tree.ts'
    import type { StoryTreeJSON } from './tree.ts'
    import * as data from './convertedlong.json'

    let tree: StoryTree = StoryTree.PopulateFromJSON(data as StoryTreeJSON);

    let currentNode: StoryNode = tree.GetRootNode();
    
    function GetCurrentPrompt(): string
    {
        return currentNode.GetPrompt();
    }

    function GetCurrentChoice(index: number): string|null
    {
        if (index < 0 || index >= tree.GetBranchesPerNode()) return null;

        return currentNode.GetChoiceText(index);
    }

    function MoveToNext(index: number)
    {
        if (index < 0 || index >= tree.GetBranchesPerNode()) return;

        // TODO: make this work, it was giving an error related to "not a function"?
        // currentNode = currentNode.GetNext(index);
    }
</script>

<p>Prompt: {GetCurrentPrompt()}</p>

{#each currentNode.branches as branches, i}
    <button
        on:click={MoveToNext(i)}
    >{GetCurrentChoice(i)}</button>
{/each}

