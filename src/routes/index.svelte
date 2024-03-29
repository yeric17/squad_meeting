<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async () => {

		return {
			status: 200
		};
	};
</script>


<script lang="ts">
    import SquadMeetingLogo from "$lib/svg/squad-meeting-logo.svelte";
    import SquadMeetingText from "$lib/svg/squad-meeting-text.svelte";
    import InputText from "$lib/form/input-text.svelte";
    import Avatar from "$lib/avatar-header.svelte";
    import ConversationList from "$lib/conversation-list.svelte";
    import {Client, Conversation, type CreateConversationOptions, type Paginator} from '@twilio/conversations'
    import { rolesSid } from "$utils/roles-sid";
    import type { ConversationInstance } from "twilio/lib/rest/conversations/v1/conversation";
    import { API_HOST } from "$utils/config";
    import Spin from "$lib/spin.svelte";
    import { onMount } from "svelte";
    import { user } from "$stores/sessionStore";

    import LoaderPage from "$lib/loader-page.svelte";
    import { goto } from "$app/navigation";
    import {customAlphabet } from 'nanoid'

    
    let client:Client;
    let sortedConversations:Conversation[];

    let joinConversationID = ""
    let isValidNew = false;
    let isValidJoin = false;
    let errorMessage = "";
    let isLoadingCreate = false;
    let isLoadingJoin = false;
    let loading = true;

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',10)

    onMount(async()=>{
        loading = true;
        
        if(!$user.logged_in){
            goto("/login")
        }

        const accesTokenResponse = await fetch(`${API_HOST}/access-token?identity=${$user.id}`);
        if(!accesTokenResponse.ok){
            console.log("Error on get Access Token")
        }
        const accesToken = await accesTokenResponse.text();
        client =  new Client(accesToken)

        await new Promise((resolve) =>{
            client.on('connectionStateChanged', state=>{
                if(state === "connected"){
                    console.log("connected conversation client")
                    resolve(state)
                }
            })
        })

        const conversationPaginator:Paginator<Conversation> = await client.getSubscribedConversations()

        sortedConversations = conversationPaginator.items;
        
        loading = false;
    })

    async function handleCreate(event:Event){
        isLoadingCreate = true;

        console.log("handleCreate")
        event.preventDefault()
        
        const convUniqueName = nanoid()

  

        if($user.id == null || $user.id == ""){
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
                identity: $user.id,
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

        const response = await fetch(`${API_HOST}/participants`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participant:{
                    identity: $user.id,
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
    {#if loading}
        <LoaderPage/>
    {:else}
    <header class="header">
        <div class="header_container">
            <div class="header_menu">
                <ConversationList list={sortedConversations}></ConversationList>
            </div>
            <Avatar
                userName={$user.name}
                avatar={$user.avatar}
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
    {/if}
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