
<script lang="ts">
    import type { Conversation, Message } from "@twilio/conversations";
    import { createEventDispatcher, onMount } from "svelte";
    import { fly } from "svelte/transition";
    import MessageCard from "./message-card.svelte";
    import ArrowDownIcon from "./svg/arrow-down-icon.svelte";

    const dispacher = createEventDispatcher()

    let showToBottomBtn = false;

    export let isTopChat = false;

    export let currentUserId:string = ""
    export let messages:Message[] = []
    export let showAdminOptions:boolean = false;
    
    function isDateEqual(date1:Date | null, date2:Date | null):boolean{
        if(date1 == null) return true;
        if(date2 == null) return true;
        
        const timeNumber2 = date2.getMinutes() + (date2.getHours() * 100)
        const timeNumber1 = date1.getMinutes() + (date1.getHours() * 100)
        const diff = Math.abs(date2.getTime() - date1.getTime())
        return Math.abs(timeNumber1 - timeNumber2) === 0 && diff < 120000
    }
    
    onMount(()=>{
        goBottomChat()
    })
    
    function goBottomChat(){
        let dummyAnchor = document.createElement("a")
        dummyAnchor.href = "#bottom_chat"
        dummyAnchor.click()
    }

    function scrollHandler(event:Event) {
        let node = event.target as HTMLElement
        
        const maxScrollTop = (node.scrollHeight - node.offsetHeight)
        const diff = maxScrollTop - node.scrollTop

        showToBottomBtn = diff  > 100
        isTopChat = node.scrollTop < 1;
        dispacher('scroll', event)
    }

    function handleReply(event:CustomEvent){
        console.log('reply from message')
        dispacher('reply',event.detail)
    }
</script>
    <section class="chat_messages" id="chatMessages" on:scroll={scrollHandler}>
        <div class="chat_message_wrapper">
            {#each messages as message, idx}
                <div class="message_container">
                    {#if idx > 0 && message.author === messages[idx - 1].author}
                        {#if idx > 0 && isDateEqual(messages[idx - 1].dateCreated,message.dateCreated)}
                            <MessageCard 
                            isMine={message.author === currentUserId}
                            showDate={false}
                            showName={false}
                            message={message}
                            showAdminOptions={showAdminOptions}
                            on:reply={handleReply}/>
                        {:else}
                            <MessageCard 
                            isMine={message.author === currentUserId}
                            showName={false}
                            message={message}
                            showAdminOptions={showAdminOptions}
                            on:reply={handleReply}/>
                        {/if}
                    {:else if idx > 0 && isDateEqual(messages[idx - 1].dateCreated,message.dateCreated)}
                        <MessageCard 
                        isMine={message.author === currentUserId}
                        message={message}
                        showDate={false}
                        showAdminOptions={showAdminOptions}
                        on:reply={handleReply}/>
                    {:else}
                        <MessageCard 
                        isMine={message.author === currentUserId}
                        message={message}
                        showName={true}
                        showDate={true}
                        showAdminOptions={showAdminOptions}
                        on:reply={handleReply}/>
                    {/if}
                </div>
                {/each}
                <span id="bottom_chat"></span>
                {#if showToBottomBtn}
                <button class="button_bottom_chat" 
                on:click={goBottomChat} 
                transition:fly={{duration:200,y:200}}>
                <ArrowDownIcon/>
                </button>
                {/if}
        </div>
    </section>
<style>

    
    .chat_messages{
        position: relative;
        height: 100%;
        overflow-y: auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: .2rem;
        padding-top: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        scroll-behavior: smooth;
    }


    .button_bottom_chat{
        position: fixed;
        bottom: 120px;
        width: 30px;
        height: 30px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        border: none;
        background-color: var(--color-orange);
        cursor: pointer;
        padding: .4rem;
        --color-text: white;
        z-index: 100;
    }
    .button_bottom_chat:hover{
        opacity: .7;
    }


</style>