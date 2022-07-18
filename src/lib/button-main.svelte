<script lang="ts">
    import { createEventDispatcher } from "svelte/internal";

    const dispatcher = createEventDispatcher();

    //export let type = "";

    function handleClick(event:Event){
        event.preventDefault();
        dispatcher("click",event);
    }
</script>

<button class="button button-main" on:click={handleClick} type="submit">
    <slot>Enviar</slot>
</button>