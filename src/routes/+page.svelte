<script>
    import { goto } from '$app/navigation';

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
        top: 60%;
        left: 50%;
        transform:translate(-50%, -60%);
        background-color: #e0ecff;
        color: black;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-family: "FreeMono", "Lucida Console", monospace;
        transition-duration: 0.4s;
        border-radius: 8px;
    }

    .button:hover {
        background-color: #f0fcff;
    }
</style>

<body>
    <button
        class="button"
        on:click={() => startGame()}
    >Start Game</button>
</body>

