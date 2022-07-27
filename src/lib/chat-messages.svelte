
<script lang="ts">
    import { addMessagesToList, addMessageToList, messageList } from "../stores/messages";
    import {onDestroy, onMount } from "svelte";
    import { fly } from "svelte/transition";
    import MessageCard from "./message-card.svelte";
    import ArrowDownIcon from "./svg/arrow-down-icon.svelte";
    import { activeConversation } from "$stores/conversations";
    import type { Message, Paginator } from "@twilio/conversations";
    import { user } from "$stores/sessionStore";
    import { getMessagePaginator } from "../services/fetch-messages";
    

    let messagesPaginator = {} as Paginator<Message>
    let isLoadingMessages = false; 
    let showToBottomBtn = false;
    export let isTopChat = false;

    
    function isDateEqual(date1:Date | null, date2:Date | null):boolean{
        if(date1 == null) return true;
        if(date2 == null) return true;
        
        const timeNumber2 = date2.getMinutes() + (date2.getHours() * 100)
        const timeNumber1 = date1.getMinutes() + (date1.getHours() * 100)
        const diff = Math.abs(date2.getTime() - date1.getTime())
        return Math.abs(timeNumber1 - timeNumber2) === 0 && diff < 120000
    }
    
    onMount(async ()=>{
        messagesPaginator = await getMessagePaginator($activeConversation,30)
	
        messageList.set(messagesPaginator.items)    

        $activeConversation.on('messageAdded',addMessage)
        goBottomChat()
    })

    onDestroy(()=>{
        $activeConversation.removeAllListeners('messageAdded')
    })
    async function addMessage(message: Message) {
		
        addMessageToList(message)
		const participant = await message.getParticipant()
		$activeConversation.emit('typingEnded',participant)
        goBottomChat();
    }

    
    function goBottomChat(){
        let dummyAnchor = document.createElement("a")
        dummyAnchor.href = "#bottom_chat"
        dummyAnchor.click()
    }

    async function scrollHandler(event:Event) {
        let node = event.target as HTMLElement
        
        const maxScrollTop = (node.scrollHeight - node.offsetHeight)
        const diff = maxScrollTop - node.scrollTop

        showToBottomBtn = diff  > 100
        isTopChat = node.scrollTop < 1;
        
        await updateMessages()
    }

    async function updateMessages(){
        if (isTopChat && !isLoadingMessages && messagesPaginator.hasPrevPage) {
			isLoadingMessages = true;
			messagesPaginator = await messagesPaginator.prevPage();
			addMessagesToList(messagesPaginator.items)
			isLoadingMessages = false;
		}
    }


</script>
    <section class="chat_messages" id="chatMessages" on:scroll={scrollHandler}>
        <div class="chat_message_wrapper">
            {#each $messageList as message, idx (message.sid)}
                <div class="message_container">
                    <MessageCard 
                    showName={(idx > 0 && message.author !== $messageList[idx - 1].author) || idx === 0}
                    showDate={(idx > 0 && isDateEqual($messageList[idx - 1].dateCreated,message.dateCreated)) || idx === 0}
                    isMine={$user.id === message.author}
                    message={message}/>
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