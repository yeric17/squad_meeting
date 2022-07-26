
<script lang="ts">
    import type { Conversation } from "@twilio/conversations";
    import CloseIcon from "$lib/svg/close-icon.svelte";
    import { fly } from "svelte/transition";
    import Spin from "./spin.svelte";
    import { clickOutside } from "./click-outside";
    import ConversationCard from "./conversation-card.svelte";
import { onMount } from "svelte";
import { user } from "$stores/sessionStore";

    export let list:Conversation[] = [];

    let myConversations:Conversation[] = []
    let conversations:Conversation[] = []

    let showList = false;
    let isLoading = false;
    let hasMessageUnread = false;

    onMount(async ()=>{


        myConversations = list.filter(c => c.createdBy === $user.id)
        conversations = list.filter(c => c.createdBy !== $user.id)
    })

    function clickOnLink(){
        isLoading = true;
    }
    function toggleMenu(){
        showList = !showList;
    }

    function handleClickOutside(){
        showList = false;
    }
</script>

<div class="side_menu" use:clickOutside on:click-outside={handleClickOutside} >
    <svg class="menu_svg" width="25px" height="25px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={toggleMenu}>
        <path opacity="0.4" d="M20 4.25V9.34998C20 10.62 19.58 11.69 18.83 12.43C18.09 13.18 17.02 13.6 15.75 13.6V15.41C15.75 16.09 14.99 16.5 14.43 16.12L13.46 15.48C13.55 15.17 13.59 14.83 13.59 14.47V10.4C13.59 8.36002 12.23 7 10.19 7H3.39999C3.25999 7 3.13 7.01002 3 7.02002V4.25C3 1.7 4.7 0 7.25 0H15.75C18.3 0 20 1.7 20 4.25Z" fill="#4F2958"/>
        <path d="M13.59 10.4V14.47C13.59 14.83 13.55 15.17 13.46 15.48C13.09 16.95 11.87 17.87 10.19 17.87H7.47L4.45 19.88C4 20.19 3.39999 19.86 3.39999 19.32V17.87C2.37999 17.87 1.53 17.53 0.940002 16.94C0.340002 16.34 0 15.49 0 14.47V10.4C0 8.50002 1.18 7.19002 3 7.02002C3.13 7.01002 3.25999 7 3.39999 7H10.19C12.23 7 13.59 8.36002 13.59 10.4Z" fill="#4F2958"/>
    </svg>
    {#if showList}
    <div class="side_container_list" in:fly={{x:-100}}>
        <div class="side_list_header">
            <span class="side_list_title">Listado de conversaciones</span>
            {#if isLoading}
            <span class="side_list_spin">
                <Spin/>
            </span>
            {/if}
            <button class="button_close" on:click={toggleMenu}><CloseIcon></CloseIcon></button>
        </div>
        <ul class="side_list">
            {#if myConversations.length > 0}
                <li class="side_list_item side_list_section">Mis Conversaciones</li>
                {#each myConversations as conv, idx (conv.sid)}
                <li class="side_list_item">
                    <ConversationCard conversation={conv}/>
                </li>
                {/each}
            {/if}
            {#if conversations.length > 0}
                <li class="side_list_item side_list_section">Compartidas</li>
                {#each conversations as conv, idx (conv.sid)}
                <li class="side_list_item">
                    <ConversationCard conversation={conv}/>
                </li>
                {/each}
            {/if}
        </ul>
    </div>
    {/if}
    {#if hasMessageUnread}
    <span class="side_menu-indicator">

    </span>
    {/if}
</div>


<style>
    .menu_svg{
        cursor: pointer;
        user-select: none;
    }
    .side_menu{
        position: relative;
    }
    .side_list_header{
        display: flex;
        justify-content: space-between;
        padding: .5rem;
        
        background-color: var(--color-blue-gray);
        color:white;
        height: 50px;
        align-items: center;
    }
    .side_container_list{
        position: fixed;
        display: flex;
        gap: .5rem;
        flex-direction: column;
        min-width: 300px;
        top: 0;
        left: 0;
        height: 100vh;
        background-color: white;
        z-index: 100;
        box-shadow: 1px .5px 4px 1px rgba(0, 0, 0,.4);
       
    }
    .side_list{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;
        overflow-x: auto;
        padding-bottom: 1rem;
    }
   
    .button_close{
        width: 1rem;
        height: 1rem;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: transparent;
        --color-text: var(--color-gray-6);
    }
    .button_close:hover{
        opacity: .5;
    }
    .side_list_section{
        padding-left: .5rem;
        color: var(--color-gray-2);
        display: block;
        padding-top: .5rem;
        padding-bottom: .5rem;
        font-weight: 600;
        color: var(--color-sea-blue);
    }
    .side_list_section:not(:first-child){
        border-top: 1px solid var(--color-gray-4);
    }
    .side_menu-indicator{
        position: absolute;
        display: block;
        top: 0;
        right: 0;
        transform: translate(50%,-50%);
        width: 10px;
        height: 10px;
        background-color: var(--color-red);
        border-radius: 4px;
    }
    .side_list_title{
        display: flex;
        flex-grow: 1;
    }
</style>