<script lang="ts">
import type { Conversation } from '@twilio/conversations';


    export let userName:string;
    export let conversationTarget:Conversation;

    let hover = false;
    let input:HTMLInputElement|null;
    let form :HTMLFormElement|null;
    let fileNames:any[] = []
    let files:FileList;

    import {onMount} from 'svelte';

    onMount(() => {
        input = document.getElementById("drop-area_input_file") as HTMLInputElement;
        form = document.getElementById("drop-area_form") as HTMLFormElement;
    })
    


    async function handleSubmit(){
        if(input == null || input.files == null || form == null) return;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            await conversationTarget.prepareMessage().addMedia(new FormData(form)).setBody(file.name).setAttributes(JSON.stringify({name:userName})).build().send()
        }
    }
    function handleDrop(event:DragEvent){
        event.dataTransfer
        if(input == null) return;
        if(event.dataTransfer == null) return;

        input.files = event.dataTransfer.files;
        input.dispatchEvent(new Event('change'));
        hover = false;
        console.log(files)
        for(let i = 0; i < input.files.length; i++){
            fileNames = [...fileNames,files[i].name] 
        }  

    }
    function handleChange(){

    }
</script>


<div class="files">
    {#each fileNames as file}
    <span class="file">{file}</span>
    {/each}
</div>

<form id="drop-area_form" on:submit|preventDefault={handleSubmit} class="drop-area_form" enctype="multipart/form-data" method="POST">
    <input 
        id="drop-area_input_file" 
        class="drop-area_input" 
        type="file" name="file" 
        on:change|preventDefault={handleChange}
        bind:files={files}/>
    <label 
        for="drop-area_input_file" class:hover={hover} 
        class="drop-area" on:dragenter|preventDefault={()=>hover=true} 
        on:dragover|preventDefault={()=>hover=true} 
        on:dragleave|preventDefault={()=>hover=false} 
        on:drop|preventDefault={handleDrop}>
        <div class="drop-area_info">
            <slot>
                <span>Arrastre y suelte archivos aquí, o de clic</span>
            </slot>
        </div>
    </label>
    <button class="button_upload" disabled={fileNames.length<1}>Subir</button>
</form>

<style>
    .drop-area_input{
        display: none;
    }
    .drop-area{
        width: 100%;
        height: 100%;
        cursor: pointer;
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--color-gray-4);
    }
    .drop-area.hover{
        background-color: var(--color-sea-blue);
    }
    .button_upload{
        display: block;
        border: none;
        background-color: var(--color-sea-blue);
        padding: .5rem;
        border-radius: 5px;
        color:var(--color-gray-6);
        margin-left: auto;
        margin-right: auto;
        margin-top: .5rem;
        padding-bottom: .5rem;
    }
    .button_upload:not(:disabled){
        cursor: pointer;
    }
    .button_upload:hover:not(:disabled){
        opacity: .6;
    }
    .button_upload:disabled{
        filter: saturate(0%) brightness(110%);
    }
</style>