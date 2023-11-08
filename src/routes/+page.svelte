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
        width: 150px;
        height: 50px;
        position:absolute;
        top: 70%;
        left: 50%;
        transform:translate(-50%, -70%);
        background-color: #e0ecff;
        color: black;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 2.5vmin;
        font-family: "FreeMono", "Lucida Console", monospace;
        transition-duration: 0.4s;
        border-radius: 8px;
    }

    .button:hover {
        background-color: #f0fcff;
    }

    .title {
        width: 80%;
        height: 20%;
        top: 10%;
        left: 50%;
        position: absolute;
        transform:translate(-50%, -10%);
        color: white;
        text-align: center;
        font-family: "FreeMono", "Lucidia Console", monospace;
    }

    .title-header {
        font-size: 8vmin;
    }

    .title-subtext {
        font-size: 5vmin;
    }
</style>

<body>

    <div class="title">
        <p class="title-header">{tree.title}</p>
        <p class="title-subtext">{tree.titleSubtext}</p>
    </div>
    
    <button
        class="button"
        on:click={() => startGame()}
    >Start Game</button>
</body>

