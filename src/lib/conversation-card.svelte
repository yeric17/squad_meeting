<script lang="ts">
import { activeConversation } from "$stores/conversations";

    import type { Conversation, JSONObject, Message } from "@twilio/conversations";
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
import { supabase } from "./supabase";

    export let conversation:Conversation;

    const displacher = createEventDispatcher()

    let messageUnread:number|null = null
    let lastMessage:Message|null = null;

    let lastMessageAuthor:string|null = null;
    onMount(async()=>{
        messageUnread = await conversation.getUnreadMessagesCount()
        
        const messages = await conversation.getMessages(1,conversation.lastMessage?.index,'backwards')
        lastMessage = messages.items[0]
        await updateMessageAuthor()
        
        // conversation.on('messageAdded', async(message)=>{
        //     lastMessage = message;
        //     await updateMessageAuthor()
        //     messageUnread = await conversation.getUnreadMessagesCount()
        // })
    })

    async function updateMessageAuthor(){
        if(lastMessage == null) return;
        const {data} = await supabase.from('profiles').select('user_name').eq('id', lastMessage.author)

        if(data){
            lastMessageAuthor = data[0].user_name
        }
    }

    function clickOnLink(){
        displacher('click')
    }

</script>

<li class="side_list_item">
    <a class="side_list_link" on:click={clickOnLink} href={`conversations/${conversation.sid}`}>
        <span class="item_name">
            {conversation.friendlyName}
        </span>
        <span class="item_date">
            {#if lastMessage}
            {lastMessage.dateCreated?.toLocaleString("es-ES",{day:'numeric',month:'numeric',year:'2-digit'})}
            {/if}
        </span>
        <span class="item_body">
            {#if lastMessage}
            <span class="body_author">
                {lastMessageAuthor}:
            </span>
            <span class="body_content">
                {lastMessage.body}
            </span>
            {/if}
        </span>
        {#if messageUnread}
        <span class="item_unread-count" class:over-limit={messageUnread > 99}>
            {messageUnread > 99?99:messageUnread}
        </span>
        {/if}
    </a>
</li>

<style>
     .side_list_link{
        --color-text: inherit;
        text-decoration: none;
        color: inherit;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: .3rem;
        padding: .5rem;
        transition: all .2s;
        position:relative;
        color: var(--color-text);
        
        position: relative;
        background-color: rgba(255,255,255,.9);
        border-radius: 5px;
        margin-right: .5rem;
        margin-left: .5rem;
        border: 1px solid var(--color-green);
    }
    
    .side_list_link:hover{
        --color-text: white;
        background-color: var(--color-blue-gray);
    }
    .item_name{
        font-weight: 500;
    }
    .item_date{
        font-size: .7rem;
    }
    .item_unread-count{
        position: absolute;
        right: 0;
        bottom: 0;
        transform: translateY(50%);
        width: 1.5rem;
        height: 1.5rem;
        background-color: var(--color-purple);
        color: white;
        display: flex;
        justify-content:center;
        align-items: center;
        border-radius: 1.5rem;
        font-weight: 900;
        font-size: .8rem;
        
    }
    .item_unread-count::after{
        content: "";
        position: absolute;
        top: 50%;
        left: 1px;
        color: var(--color-purple);
        width: .9rem;
        height: .9rem;
        
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: .8rem;
        transform: translateY(-50%) translateX(-100%);
    }   
    .item_unread-count.over-limit::after{
        content: "+";
    }
    .item_body{
        max-width: 220px;
        font-size: .8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .body_author{
        font-weight: 600;
    }
</style>