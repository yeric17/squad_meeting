<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load:Load = async ({params, fetch, session}) => {

        const currentSession:any = session;
        
        const user = currentSession.user

        if(user == null || !user.logged_in){
            return {
                status: httpStatusCode.Found,
                redirect: "/",
            }
        }
        
        const conversationId = params.conversation_id
        
        const accesTokenResponse = await fetch(`${API_HOST}/access-token?identity=${user.id}`);
        
        if(!accesTokenResponse.ok){
            console.log("Error on get Access Token")
        }

        const accesToken = await accesTokenResponse.text();
        
        const client =  new Client(accesToken)

        const conversation = await client.getConversationBySid(conversationId)

        const participants:Participant[] = await conversation.getParticipants()

        let userIsParticipant = false;
        for(let participant of participants){
            if(participant.identity === user.id){
                userIsParticipant = true;
                break;
            }
        }

        if(!userIsParticipant){
            return {
                status: httpStatusCode.MovedPermanently,
                redirect: "/"
            }
        }

        let messagesPaginator:Paginator<Message> = await conversation.getMessages(20,undefined,'backwards')
        
        let messages:Message[] = messagesPaginator.items;

        console.log({messages})
        const status:ConversationStatus = conversation.status
        console.log(status)
        if(status !== 'joined'){
            await conversation.join()
        }
        return {
            status:200,
            props: {
                conversation,
                messages,
                user,
                messagesPaginator,
            }
        }
    }
</script>

<script lang="ts">
    import SquadMeetingLogo from "$lib/svg/squad-meeting-logo.svelte";
    import Avatar from "$lib/avatar.svelte";
    import SendIcon from "$lib/svg/send-icon.svelte";
    import { Client, Conversation, Message, Participant, type ConversationStatus, type Paginator } from "@twilio/conversations";
    import { httpStatusCode } from "../../utils/http-status-codes";
    import { onDestroy, onMount } from "svelte";
    import { API_HOST } from "../../utils/config";
    import LinkIcon from "$lib/svg/link-icon.svelte";
    import TypingIndicator from "$lib/typing_indicator.svelte";
    import ChatMessages from "$lib/chat-messages.svelte";
    import EmoticonIcon from "$lib/svg/emoticon-icon.svelte";
    import PaperclipIcon from "$lib/svg/paperclip-icon.svelte";
    import EmoticonOption from "$lib/emoticon-option.svelte";
    import { slide } from "svelte/transition";
import DropArea from "$lib/drop-area.svelte";


   

    export let user:any = null;
    export let conversation:Conversation;
    export let messages:Message[]=[];
    export let messagesPaginator:Paginator<Message>;
    //export let participants:Participant[]=[];

    let showChangeNameInput = false;
    let textInput = ""
    let newConversationName = ""
    let typingUser:any = null;

    let isTopChat = false;
    let isLoadingMessages = false;

    let emoticonsIsActive = false;
    let atachmentIsActive = false;

    onMount(()=>{
      conversation.on('messageAdded',addMessage )
      
      conversation.on('typingStarted', async (participant)=>{
        typingUser = participant.attributes
        
      })
      conversation.on('typingEnded', ()=>{
        typingUser = null
      })
      
    });

    onDestroy(()=>{
        console.log("Destroy object")
    })

    function addMessage(message:Message){
        messages = [...messages, message]
        goBottomChat()
    }

    function showChangeName(){
        newConversationName = conversation.friendlyName?conversation.friendlyName:""
        console.log(conversation.friendlyName)
        showChangeNameInput = true;
    }

    function hideChangeName(){
        showChangeNameInput = false;
    }

    async function handleChangeName(){

        if(newConversationName==="")return;
        const newConversation = await conversation.updateFriendlyName(newConversationName)
        conversation = newConversation
        hideChangeName()
    }

    async function handleSubmit(event:Event) {
        event.preventDefault()
        if(textInput === "") return
        //const participant = await conversation.getParticipantByIdentity(user.id)
        const response = await conversation.sendMessage(textInput,JSON.stringify({
            name: user?.name,
        }))
        console.log(response)
        console.log("send message")
        textInput = ""
    }

    function handleKeydown(event:KeyboardEvent){
        if(showChangeNameInput && event.key === 'Escape'){
            hideChangeName()
        }
        else if(emoticonsIsActive && event.key === 'Escape') {
            emoticonsIsActive = false;
        }
        else if(!showChangeNameInput){
            document.getElementById('chatMessage')?.focus()
        }
    }
    
    async function copyClipboardId() {

        if(!conversation.uniqueName) return;

        await navigator.clipboard.writeText(conversation.uniqueName)
    }



    function handleInputChat() {
        conversation.typing()
    }

    function goBottomChat(){
        let dummyAnchor = document.createElement("a")
        dummyAnchor.href = "#bottom_chat"
        dummyAnchor.click()
    }

    async function handleChatScroll(){
        if(isTopChat && !isLoadingMessages && messagesPaginator.hasPrevPage){
            
            isLoadingMessages = true;
            messagesPaginator = await messagesPaginator.prevPage()
            messages = [...messagesPaginator.items,...messages]
            isLoadingMessages = false;

        }
    }

    function handleEmoticons(target:CustomEvent){
        const emoticon = target.detail
        textInput += emoticon
    }

    function toggleEmoticons(){
        emoticonsIsActive = !emoticonsIsActive;
        if(emoticonsIsActive){
            atachmentIsActive = false;
        }
    }
    function toggleAtachments(){
        atachmentIsActive = !atachmentIsActive;
        if(atachmentIsActive){
            emoticonsIsActive = false;
        }
    }
</script>

<svelte:head>
    <title>Conversacion - {conversation.sid}</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown}/>

<div class="app_container">
    <header class="conv_header">
        <div class="header_logo">
            <a href="/"><SquadMeetingLogo/></a>
        </div>
        <div class="conv_title">
            {#if showChangeNameInput}
            <form on:submit|preventDefault={handleChangeName}>
                <input class="change-name_input" type="text" bind:value={newConversationName} />
            </form>
            {:else}
            <span on:click={showChangeName}>
                {conversation.friendlyName}
            </span>
            {#if conversation.createdBy === user.id}
            <span class="conv_share" on:click={copyClipboardId}>
                <LinkIcon></LinkIcon>
            </span>
            {/if}
            {/if}
        </div>
        <div class="header_user-info">
            <Avatar userName={user.name}/>
        </div>
    </header>
    <section class="side-menu_chat">

    </section>

    <ChatMessages messages={messages} currentUserId={user.id} bind:isTopChat={isTopChat} on:scroll={handleChatScroll} ></ChatMessages>
    
    <section class="chat_controls">
        {#if typingUser}
            <div class="typing_info">
                <TypingIndicator name={typingUser.name}/>
            </div>
        {/if}
        <form on:submit={handleSubmit} class="chat_form_text">
            <input 
            type="text" 
            on:keydown={handleInputChat} 
            bind:value={textInput} 
            class="chat_input" 
            name="chat" 
            id="chatMessage" 
            placeholder="Escribe el nuevo mensaje" />
            <button class="button_send" on:click={handleSubmit}><SendIcon/></button>
        </form>
        <div class="chat_options">
            <span class="chat_option" on:click={toggleEmoticons}>
                <EmoticonIcon/>
            </span>
            <span class="chat_option" on:click={toggleAtachments}>
                <PaperclipIcon/>
            </span>
        </div>
        {#if emoticonsIsActive}
        <div class="chat_options_window" class:active={emoticonsIsActive} transition:slide>
            {#if emoticonsIsActive}
            <div class="window_emoticons">
                <EmoticonOption on:select-emoticon={handleEmoticons}/>
            </div>
            {/if}
        </div>
        {/if}
        {#if atachmentIsActive}
        <div class="chat_options_window" class:active={atachmentIsActive} transition:slide>
            <div class="window_drop">
                <DropArea conversationTarget={conversation} userName={user.name}/>
            </div>
        </div>
        {/if}
    </section>
</div>



<style>
    .app_container{
        height: 100vh;
        
        background-color: var(--color-gray-5);
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr auto;
        
    }
    .conv_header{
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 1rem;
        padding-right: 1rem;
        background-color: var(--color-gray-6);
        border-bottom: 2px solid var(--color-sea-blue);
        grid-column: span 2;
    }
    .header_logo{
        width: 34.88px;
        height: 24px;
    }
    .header_user-info{
        display: flex;
        align-items: center;
        gap:.5rem;
    }

    .chat_input{
        width: 100%;
        resize: none;
        height: 40px;
        border: 1px solid var(--color-gray-4);
        padding: .5rem;
        border-radius: 5px;
        outline: none;
        font-weight: 300;
    }
    .chat_input:focus{
        border: 1px solid var(--color-purple);
    }
    .chat_form_text{
        display: flex;
        gap:.3rem;
        padding-left: .5rem;
        padding-right: .5rem;
        padding-top: 1rem;
        padding-bottom: .5rem;
        align-items: center;
        background-color: var(--color-gray-6);
       
    }
    .button_send{
        border: none;
        width: 2.3rem;
        height: 2rem;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--color-sea-blue);
        cursor: pointer;
    }
    .change-name_input{
        border: none;
        background-color: transparent;
        text-align: center;
        font-size: 1rem;
        font-weight: inherit;
        font-family: "Karla";
        outline: none;
        letter-spacing: inherit;
        background-color: var(--color-gray-5);
    }

    .conv_share{
        display: block;
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        --color-text: var(--color-gray-3);
    }
    .conv_share:hover{
        --color-text: var(--color-gray-1);
    }
    .conv_title{
        display: flex;
        gap: .5rem;
        align-items: center;
    }
    .chat_controls{
        position: relative;
    }
    .typing_info{
        padding: .5rem;
        padding-left: .8rem;
        padding-bottom: .25rem;
        position:absolute;
        top: 0;
        transform: translateY(-100%);
        background-color: var(--color-gray-6);
        border-top-right-radius: 5px;
    }
    .side-menu_chat{
        grid-row: span 3;
    }

    .chat_options{
        background-color: var(--color-gray-6);
        padding-bottom: 1rem;
        padding-left: .5rem;
        display: flex;
        gap: .5rem;
    }

    .chat_option{
        display: flex;
        width: 1.4rem;
        height: 1.4rem;
        padding: .25rem;
       --color-text: var(--color-gray-3);
       border-radius: 4px;
       cursor: pointer;
    }
    .chat_option:hover{
        background-color: var(--color-sea-blue);
        
        --color-text: var(--color-gray-6);
    }

    .chat_options_window{
        overflow-y: scroll;
        padding-left: .5rem;
        padding-right: .5rem;
        background-color: var(--color-gray-6);
        border-top: 1px solid var(--color-gray-5);
        padding-bottom: 1rem;
        padding-top: 1rem;
    }

</style>