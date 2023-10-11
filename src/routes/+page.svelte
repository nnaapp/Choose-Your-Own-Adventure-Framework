<script lang="ts">
    import { StoryTree, StoryNode } from './tree.ts'
    import type { StoryTreeJSON } from './tree.ts'
    import * as data from './convertedlong.json'

    let tree: StoryTree = StoryTree.PopulateFromJSON(data as StoryTreeJSON);

    function printRoot()
    {
        tree.GetRootNode()?.Print();
    }
</script>

<button on:click={printRoot}>
    print root
</button>
