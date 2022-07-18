<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispacher = createEventDispatcher();
    export let value:any = null;
    export let placeholder:string = "Escriba aquí...";

    export let isValid = false;

    function Validation(event:Event){
        event.preventDefault();
        dispacher("input",event)
        isValid = value != null && value !== ""
    }
</script>

<input 
type="text" 
bind:value={value} 
class="input-text"
placeholder={placeholder}
on:input={Validation}
class:valid={isValid && value !== ""}
class:error={!isValid && value !== ""}
/>

<style>
    .input-text {
        width: 100%;
        min-height: 40px;
        border: 1px solid var(--color-blue-gray);
        border-radius: 4px;
        background-color: var(--color-gray-6);
        outline: none;
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .input-text:focus{
        border: 2px solid var(--color-sea-blue);
    }
    .input-text:hover{
        background-color: white;
    }
    .input-text.valid{
        border: 1px solid var(--color-green);
    }
    .input-text.error{
        border: 1px solid var(--color-red);
    }
</style>