<!-- ButtonCard.svelte -->
<script>
    export let node;
    export let startGame;
</script>

<div class="flex flex-col overflow-hidden rounded-xl shadow-md w-64 bg-white text-black">
    <div class="h-40 mx-4 -mt-6 mt-2 shadow-lg overflow-hidden bg-clip-border rounded-xl bg-blue-gray-500">
        <img src={node.imageUrl} alt="Card image"/>
    </div>
    <div class="p-6">
        <h5 class="text-center">{node.title}</h5>
    </div>
    <div class="p-6 pt-0">
        <button class="w-full align-middle rounded-lg bg-black text-white hover:scale-105 hover:shadow-lg hover:shadow-gray-900/20 duration-300" type="button" on:click={startGame}>
            Start
        </button>
    </div>
</div>
