<script lang="ts">
    import { goto } from '$app/navigation';
    import { gameTree, currentTreeIndex } from '../tree_store.ts';
    import { writable } from 'svelte/store';

    let trees: StoryTree;
    gameTree.subscribe((value) => {
        console.log("Story tree read from store.")
        trees = value;
    });

    function startGame(treeIndex: number)
    {
        currentTreeIndex.set(treeIndex);
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

<body style="--primaryFont: {trees.fonts[0]}; 
    --secondaryFont: {trees.fonts[1]}; 
    --tertiaryFont: {trees.fonts[2]}; 
    --bkgColor1: {trees.backgroundColors[0]}; 
    --bkgColor2: {trees.backgroundColors[1]}; 
    --textColor: {trees.accentColor};"
>
    <div class="flex justify-center">
        <div id="title" class="h-1/5 w-4/5 mt-6 text-center">
            <p class="text-6xl">{trees.title}</p>
            <p class="text-4xl">{trees.titleSubtext}</p>
        </div>
    </div>

    <div class="flex justify-evenly items-center mt-40">
        <!-- button card testing -->
        {#each trees.nodes as nodes, i}
        <div class="flex flex-col overflow-hidden rounded-xl shadow-md w-64 bg-white text-black">
            <div class="h-40 mx-4 -mt-6 mt-2 shadow-lg overflow-hidden bg-clip-border rounded-xl bg-blue-gray-500">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
                    alt="Placeholder image"/>
            </div>
            <div class="p-6">
                <h5 class="text-center">Story 1:</h5>
                <p>Central line insertion</p>
            </div>
            <div class="p-6 pt-0">
                <button
                    class="w-full align-middle rounded-lg bg-black text-white hover:scale-105 hover:shadow-lg hover:shadow-gray-900/20 duration-300"
                    type="button"
                    on:click={() => startGame(i)}>
                    Start
                </button>
            </div>
        </div>
        {/each}
    </div>

    <!--    
    <button
        class="start-btn w-full h-14 text-center text-xl inline-block absolute top-3/4 -translate-y-3/4 left-1/2 -translate-x-1/2"
        style="background-color: {trees.menuColor};"
        on:click={() => startGame()}
    >Start Game</button>
    -->
</body>

