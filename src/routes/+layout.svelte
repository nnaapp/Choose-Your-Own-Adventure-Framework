<script lang="ts">
    import '../global.css';
    import { gameTree } from '../tree_store.ts';

    let tree: StoryTree;
    gameTree.subscribe((value) => {
        console.log("Story tree read from store.")
        tree = value;
    });

    let primaryFont = tree.fonts[0];
    let backupFont = tree.fonts[1];
    let genericFont = tree.fonts[2];
</script>

<style>
    body {
        height: 100%;
        padding: 0;
        margin: 0;
        background-image: linear-gradient(#252e3d, #0D1117); 
        background-repeat: no-repeat;
        background-attachment: fixed;
    }

    html *{
        font-family: var(--primaryFont), var(--backupFont), var(--genericFont);
    }
</style>

<slot />
