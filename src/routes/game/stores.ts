import { Writable, writable, derived } from 'svelte/store'

class ButtonTypeStore
{
    public Type: Writable<string>;

    constructor()
    {
        this.Type = writable('');
    }

    get buttonType()
    {
        return derived(
            [this.Type],
            ([$Type]) => {
                return $Type;
            }
        )
    }
}

export const myType = new ButtonTypeStore();
// export const createTypeStore = () => new ButtonTypeStore();
