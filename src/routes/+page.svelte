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

<style>
    .button {
        width: 100%;
        height: 50px;
        position:absolute;
        top: 70%;
        left: 50%;
        transform:translate(-50%, -70%);
        background-color: #0d1117;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 2.5vmin;
        transition: background-color 0.4s;
        font-family: inherit;
        border: none;
    }

    .button:hover {
        background-color: #242a34;
    }

    menu-title {
        width: 80%;
        height: 20%;
        top: 10%;
        left: 50%;
        position: absolute;
        transform:translate(-50%, -10%);
        color: white;
        text-align: center;
    }

    .title-header {
        font-size: 8vmin;
    }

    .title-subtext {
        font-size: 5vmin;
    }
</style>

<body style="--primary: {tree.fonts[0]}; --secondary: {tree.fonts[1]}; --tertiary: {tree.fonts[2]}">
    <menu-title>
        <p class="title-header">{tree.title}</p>
        <p class="title-subtext">{tree.titleSubtext}</p>
    </menu-title>
    
    <button
        class="button"
        on:click={() => startGame()}
    >Start Game</button>
</body>

