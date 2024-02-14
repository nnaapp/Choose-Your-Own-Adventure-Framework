<script lang="ts">
    import { goto } from '$app/navigation';
    import { gameTree } from '../tree_store.ts';

    let tree: StoryTree;
    gameTree.subscribe((value) => {
        console.log("Story tree read from store.")
        tree = value;
    });

    function startGame()
    {
        goto('/game', { replaceState: false })
    }
</script>

<style lang="postcss">
    body {
        color: var(--textColor);
    }

    .start-btn {
        color: inherit;
        transition: filter 0.5s;
        font-family: inherit;
    }

    .start-btn:hover {
        filter: brightness(1.1);
    }
</style>

<body style="--primaryFont: {tree.fonts[0]}; 
    --secondaryFont: {tree.fonts[1]}; 
    --tertiaryFont: {tree.fonts[2]}; 
    --bkgColor1: {tree.backgroundColors[0]}; 
    --bkgColor2: {tree.backgroundColors[1]}; 
    --textColor: {tree.accentColor};"
>
    <div id="title" class="h-1/5 w-4/5 text-center absolute top-1/4 -translate-y-1/4 left-2/4 -translate-x-2/4">
        <p class="text-6xl">{tree.title}</p>
        <p class="text-4xl">{tree.titleSubtext}</p>
    </div>
    
    <button
        class="start-btn w-full h-14 text-center text-xl inline-block absolute top-3/4 -translate-y-3/4 left-1/2 -translate-x-1/2"
        style="background-color: {tree.menuColor};"
        on:click={() => startGame()}
    >Start Game</button>
</body>

