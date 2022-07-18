<script lang="ts">
    export let value:string = "";
    export let isValid:Boolean = false;
    export let validateInput = true;

    const regexp:RegExp = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;

    function Validation(event:Event){
        event.preventDefault();
        isValid = regexp.test(value) || (!validateInput && value !== "");
    }
</script>




<input 
type="password"
bind:value={value} 
class="input-text"
placeholder="Contraseña"
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