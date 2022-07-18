<script lang="ts">
    import { fade } from "svelte/transition";
    export let isMine:boolean = true;

    export let author:string = "";
    export let createAt:Date|null = null;

    export let color:string = "#333333"

    function getFormatDate(value:Date){
        return value.toLocaleString("es-Es",{
                timeZone:'America/Bogota',
                minute:'numeric',
                hour:'2-digit',
                month: 'short',
                year: 'numeric',
                day: '2-digit'
            })
    }
    
</script>


<div class="message" transition:fade={{duration:250}}>
    <div class="message_content" class:my-message={isMine}>
        <div class="message_info">
            {#if !isMine}
            <span class="message_author">{author}</span>
            {/if}
            {#if createAt}
            <span class="message_date">{getFormatDate(createAt)}</span>
            {/if}
        </div>
        <div class="message_body" style={`--color-body:${color}`}>
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .message_content{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .message_content.my-message{
        align-items: flex-end;
    }

    .message_body{
        background-color: white;
        padding: .5rem;
        display: inline-flex;
        max-width: 75%;
        border-top: 2px solid var(--color-body);
        border-radius: 5px;
        border-bottom-left-radius: 0;
        font-size: .9rem;
        flex-grow: 0;
        line-height: 1.25rem;
    }
    .message_content.my-message .message_body{
        background-color: var(--color-sea-blue);
        border-color: var(--color-blue-gray);
        color: white;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 0;
    }
    .message_date {
        font-size: .7rem;
        font-weight: 300;
    }
    .message_info{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap:.3rem;
        padding-bottom: .3rem;
    }

    .message_content.my-message .message_info{
        align-items: flex-end;
    }
    .message_author{
        font-size: .9rem;
    }
</style>