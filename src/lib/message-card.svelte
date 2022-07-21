<script lang="ts">
    import type { Message } from "@twilio/conversations";
    import { onMount } from "svelte";

    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    import ExcelIcon from "./svg/excel-icon.svelte";

    // import ReplyMessageIcon from "./svg/reply-message-icon.svelte";
    // import TrashIcon from "./svg/trash-icon.svelte";
    export let isMine:boolean = true;
    export let message:Message;

    export let showDate:boolean = true;
    export let showName:boolean = false;
    export let showAdminOptions:boolean = false;

    let hasMedia = false;
    let messageMediaURL:string = "";
    let isImage = false;
    let isExcel = false;
    let isRemoved = false;

    

    const dispacher = createEventDispatcher()

    let attributes:any = {
        name: "",
        color: "#FFFFFF",
    }
    onMount(async()=>{


        let str = message.attributes?.toString()

        attributes = str == null?"":JSON.parse(str)

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

    function handleReply(){
        console.log('reply from message')
        dispacher('reply', message)
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
            {#if attributes.reply}
            <a href="#{attributes.reply.sid}" class="reply_info">
                <span class="reply_user-name">
                    {attributes.name}    
                </span>
                <span class="reply_body">
                    {attributes.reply.body}
                </span>
            </a>
            {/if}
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
                    <li class="menu_option" on:click={handleReply}>responder</li>
                   {#if showAdminOptions} <li class="menu_option" on:click={handleDelete}>eliminar</li>{/if}
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
        display: flex;
        flex-direction: column;
        top: 0;
        right: 0;
        transform: translateX(100%);
        border-radius: 4px;
        display: none;
        width: 100px;
        
        overflow: hidden;
    }
    .message_content.my-message .body_menu{
        left: 0;
        transform: translateX(-100%);
    }
    .message_body:hover .body_menu{
        display: flex;
    }
    .body_menu_list{
        background-color: var(--color-gray-6);
    }
    .menu_option{
        padding: .25rem;
        color: var(--color-gray-1);
        cursor: pointer;
        display: flex;
        width: auto;
    }
    .menu_option:hover{
        background-color: var(--color-gray-4);
    }
    .body_media img{
        display: block;
        max-width: 100%;
    }
    .reply_info{
        display: block;
        background-color: var(--color-gray-6);
        padding: .5rem;
        border-left: 2px solid var(--color-orange);
        padding-left: .5rem;
        border-radius: 5px;
        margin-bottom: .5rem;
    }
    .reply_user-name{
        color: var(--color-gray-4);
    }
    .reply_body{
        display: inline-flex;
        max-width: 150px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--color-gray-3);
        
    }
</style>