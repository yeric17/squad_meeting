<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";
    
    export const load: Load = async({fetch, session}) => {
        
        const currentSession:any = session;
        
        const user = currentSession.user
        console.log(user)
        if(user == null || !user.logged_in){
            return {
                status: httpStatusCode.Found,
                redirect: "/login",
            }
        }
        
        const accesTokenResponse = await fetch(`${API_HOST}/access-token?identity=${user.id}`);
        
        if(!accesTokenResponse.ok){
            console.log("Error on get Access Token")
        }

        const accesToken = await accesTokenResponse.text();
        
        const client =  new Client(accesToken)

        await new Promise((resolve) =>{
            client.on('connectionStateChanged', state=>{
                if(state === "connected"){
                    console.log("connected conversation client")
                    resolve(state)
                }
            })
        })

        // get the conversations paginator
        let conversationsPaginator: Paginator<Conversation> = await client.getSubscribedConversations();

        // get conversations
        const conversations: Conversation[] = conversationsPaginator.items;

        let visibleConversations:Conversation[] = await new Promise(resolve=>{
            const tempConv =conversations.filter( async conversation=>{
                let participants: Participant[] = await conversation.getParticipants();
                return participants.find(participant => participant.identity === user.id)
            })
            resolve(tempConv)
        })
        
        const sortedConversations = visibleConversations.sort((a, b) => {
            if(a.createdBy === user.id && b.createdBy === user.id){
                return 0
            }
            if(a.createdBy === user.id) return -1
            if(b.createdBy === user.id) return 1
            return 0
        })

        return {
            status: 200,
            props: {
                user,
                client,
                sortedConversations
            }
        }
        
    }
</script>

<script lang="ts">
    import SquadMeetingLogo from "$lib/svg/squad-meeting-logo.svelte";
    import SquadMeetingText from "$lib/svg/squad-meeting-text.svelte";
    import InputText from "$lib/form/input-text.svelte";
    import Avatar from "$lib/avatar.svelte";
    import ConversationList from "$lib/conversation-list.svelte";
    import {Client, Conversation, Participant, type CreateConversationOptions, type Paginator} from '@twilio/conversations'
    import { rolesSid } from "../utils/roles-sid";
    //import type {UserListInstanceCreateOptions } from "twilio/lib/rest/chat/v1/service/user";
    import type { ConversationInstance } from "twilio/lib/rest/conversations/v1/conversation";
    
    import { getColor } from "$lib/get-color-index";
    import { API_HOST } from "../utils/config";
    import { httpStatusCode } from "../utils/http-status-codes";
    import Spin from "$lib/spin.svelte";

    export let user:any;
    export let client:Client;
    export let sortedConversations:Conversation[];

    let joinConversationID = ""
    let isValidNew = false;
    let isValidJoin = false;
    let errorMessage = "";
    let isLoadingCreate = false;
    let isLoadingJoin = false;

    async function handleCreate(event:Event){
        isLoadingCreate = true;

        console.log("handleCreate")
        event.preventDefault()
        
        const convUniqueName = crypto.randomUUID();

        if(user.id == null || user.id == ""){
            isLoadingCreate = false;
            return;
        } 
        

        const conversationOptions:CreateConversationOptions = {
            uniqueName: convUniqueName,
            friendlyName: "Default",
        }
        console.log("before connected")


        const newConversation = await client.createConversation(conversationOptions)

        const newParticipant = {
            participant:{
                identity: user.id,
                roleSid: rolesSid.channelAdmin
            },
            conversationSid:newConversation.sid
        }
        
        await fetch(`${API_HOST}/participants`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newParticipant)
        })
        isLoadingCreate = false;

        window.location.href = `conversations/${newConversation.sid}`
        
    }



    async function handleJoin(event:Event){
        console.log("handleJoin")
        isLoadingJoin = true;
        event.preventDefault();
        if(joinConversationID === "") return;
        
        const convResponse = await fetch("api/conversations?uniqueName=" + joinConversationID)

        if(!convResponse.ok){
            isLoadingJoin = false;
            return;
        }
        const conversation:ConversationInstance = await convResponse.json()
        const listConversations = await client.getSubscribedConversations()

        const response = await fetch(`${API_HOST}/participants`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participant:{
                    identity: user.id,
                    roleSid: rolesSid.channelUser,
                },
                conversationSid: conversation.sid
            })
        })

        if(!response.ok){
            console.log("failed add participant")
            isValidJoin = false
            errorMessage = "Fallo al agregar un participante"
            isLoadingJoin = false;
            return
        }

        window.location.href = `conversations/${conversation.sid}`
    }
</script>

<svelte:head>
    <title>Iniciar conversacion</title>
</svelte:head>
<section class="page_container">
    <header class="header">
        <div class="header_container">
            <div class="header_menu">
                <ConversationList list={sortedConversations} userId={user.id}></ConversationList>
            </div>
            <Avatar
                userName={user.name}
                avatar={user.avatar}
                namePosition="left"
            />
        </div>
    </header>
    <section class="banner">
        <span class="banner_logo">
            <SquadMeetingLogo/>
        </span>
    </section>
    <section class="content">
        <h1 class="content_title">Iniciar una conversación</h1>
        <div class="forms">
    
            <form class="init-form" on:submit={handleCreate}>
                <button class="button button-main" type="submit">
                    {#if isLoadingCreate}
                    <Spin/>
                    {:else}
                    Crear una nueva
                    {/if}
                </button>
                {#if !isValidNew}
                    <span class="error">
                        {errorMessage}
                    </span>
                {/if}
            </form>
            <form class="init-form" on:submit={handleJoin}>
                <InputText placeholder="ID de la conversación" bind:isValid={isValidJoin} bind:value={joinConversationID}></InputText>
                <button class="button button-secondary" type="submit">
                    {#if isLoadingJoin}
                    <Spin/>
                    {:else}
                    Unirse a una
                    {/if}
                </button>
            </form>
        </div>
    </section>
    <footer class="footer">
        <div class="footer_container">
            <div class="footer_logo">
                <SquadMeetingText/>
            </div>
        </div>
    </footer>
</section>

<style>
    .page_container{
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        min-height: 100vh;
    }
    .header_container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .5rem;
        height: 50px;
        border-bottom: 1px solid var(--color-gray-5);
    }
    .banner_logo{
        display: block;
        max-width: 200px;
        padding-top: 1rem;
        margin-left: auto;
        margin-right: auto;
    }
    .content{
        display: flex;
        flex-direction: column;
        padding-top: 1rem;
        padding-bottom: 2rem;
        gap: 3rem;
    }
    .content_title{
        text-align: center;
        padding-top: 2rem;
    }
    .forms{
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        justify-items: center;
    }
    .init-form{
        display: grid;
        grid-template-columns: 1fr;
        justify-items: center;
        
        gap: 1rem;
        width:100%;
        max-width: 300px;
    }
    .button {
        width: 100%;
    }

    .footer_logo{
        display: block;
        text-align: center;
        padding-bottom: 1rem;
        max-width: 200px;
        margin-left: auto;
        margin-right: auto;
    }

</style>