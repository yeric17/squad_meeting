<script lang="ts">
    import type { Message } from "@twilio/conversations";
    import { onMount } from "svelte";

    import { fade } from "svelte/transition";

    import ExcelIcon from "./svg/excel-icon.svelte";
    import ReplyMessageIcon from "./svg/reply-message-icon.svelte";
    import TrashIcon from "./svg/trash-icon.svelte";
    export let isMine:boolean = true;
    export let message:Message;

    export let showDate:boolean = true;
    export let showName:boolean = false;

    let hasMedia = false;
    let messageMediaURL:string = "";
    let isImage = false;
    let isExcel = false;
    let isRemoved = false;

    let attributes:any = {
        name: "",
        color: "#FFFFFF",
    }
    onMount(async ()=>{

        if(message.participantSid){
            const participant = await message.conversation.getParticipantBySid(message.participantSid)

            if(participant && participant.attributes){
                attributes = JSON.parse(JSON.stringify(participant.attributes))
            }
        }
        

        if(message.attachedMedia && message.attachedMedia.length > 0){
            const categorizedMedia  = message.getMediaByCategory(["media"]);

            if(categorizedMedia == null) return;

            const mediaUrl = await categorizedMedia[0].getContentTemporaryUrl();

            if(mediaUrl == null) return
            hasMedia = true;
            messageMediaURL = mediaUrl;
            const contentType = message.attachedMedia[0].contentType;
            isImage = /image\/png|image\/jpg|image\/svg/.test(message.attachedMedia[0].contentType)
            isExcel = /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/.test(contentType)
        }
    })

    async function handleDelete(){
        await message.remove()
        isRemoved = true;
    }

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


<div class="message" transition:fade={{duration:250}} id={message.sid} class:removed={isRemoved}>
    <div class="message_content" class:my-message={isMine}>
        <div class="message_info">
            {#if !isMine && showName}
            <span class="message_author">{attributes.name}</span>
            {/if}
            {#if showDate && message.dateCreated}
            <span class="message_date">{getFormatDate(message.dateCreated)}</span>
            {/if}
        </div>
        <div class="message_body" style={`--color-body:${attributes.color}`}>
            <span class="body_reply">

            </span>
            <span class="body_text">
                {message.body}
            </span>
            {#if hasMedia}
            <div class="body_media">
                {#if isImage}
                <a target="_blank" href={messageMediaURL} download={messageMediaURL}><img src={messageMediaURL} alt="message media"></a>
                {:else if isExcel}
                <a target="_blank" href={messageMediaURL} download={messageMediaURL}><ExcelIcon/></a>
                {:else}
                <a target="_blank" href={messageMediaURL} download={messageMediaURL}>{messageMediaURL}</a>
                {/if}
            </div>
            {/if}
            <div class="body_menu">
                <ul class="body_menu_list">
                    <li class="menu_option reply"><ReplyMessageIcon/></li>
                    <li class="menu_option delete" on:click={handleDelete}><TrashIcon/></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
    .message.removed{
        display: none;
    }
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
        display: flex;
        flex-direction: column;
        max-width: 75%;
        border-top: 2px solid var(--color-body);
        border-radius: 5px;
        border-bottom-left-radius: 0;
        font-size: .9rem;
        flex-grow: 0;
        line-height: 1.25rem;
        position: relative;
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
    .body_menu{
        position: absolute;
        width: 1.5rem;
        padding: .25rem;
        display: flex;
        flex-direction: column;
        gap: .1rem;
        top: 0;
        right: 0;
        transform: translateX(100%);
        background-color: var(--color-gray-6);
        border-radius: 4px;
        display: none;
    }
    .message_content.my-message .body_menu{
        left: 0;
        transform: translateX(-100%);
    }
    .message_body:hover .body_menu{
        display: block;
    }
    .menu_option{
        --color-text: var(--color-gray-2);
        cursor: pointer;
    }
    .menu_option.delete{
        --color-text: var(--color-red);
    }
</style>