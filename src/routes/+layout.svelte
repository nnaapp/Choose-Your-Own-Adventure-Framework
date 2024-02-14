<script lang="ts">
    import { gameTree } from '../tree_store.ts';
    import { onNavigate } from '$app/navigation';
		import "../app.css";

    let tree: StoryTree;
    gameTree.subscribe((value) => {
        console.log("Story tree read from store.")
        tree = value;
    });

    // From SvelteKit guide on page transitions
    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

	      return new Promise((resolve) => {
		        document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

<style lang="postcss">
:global(body) {
    height: 100%;
    padding: 0;
    margin: 0;
    background-color: #19202A;
    background-image: linear-gradient(var(--bkgColor1), var(--bkgColor2)); 
    background-repeat: no-repeat;
    background-attachment: fixed;
		font-family: var(--primaryFont), var(--secondaryFont), var(--tertiaryFont);
		overflow-wrap: break-word;
		word-wrap: break-word;
		color: black;
}

@keyframes fade-in {
	from {
		opacity: 0;
	}
}

@keyframes fade-out {
	to {
		opacity: 0;
	}
}

@keyframes slide-from-right {
	from {
		transform: translateX(30px);
	}
}

@keyframes slide-to-left {
	to {
		transform: translateX(-30px);
	}
}

:root::view-transition-old(root) {
	animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

:root::view-transition-new(root) {
	animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in, 300ms cubic-bezier(0.4, 0, 0.2, 1) both
			slide-from-right;
}
</style>

<slot />
