
<script lang="ts">
    import type { Conversation } from "@twilio/conversations";
    import CloseIcon from "$lib/svg/close-icon.svelte";
    import { fly } from "svelte/transition";
    import Spin from "./spin.svelte";
    import { clickOutside } from "./click-outside";

    export let list:Conversation[] = [];
    export let userId:string = "";
    let showList = false;
    let isLoading = false;
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
            <span>Listado de conversaciones</span>
            {#if isLoading}
            <Spin/>
            {/if}
            <button class="button_close" on:click={toggleMenu}><CloseIcon color={"#F2F2F2"}></CloseIcon></button>
        </div>
        <ul class="side_list">
            {#each list as conv, idx}
            {#if idx === 0}
            <span class="side_list_section">Mis Conversaciones</span>
            {/if}
            {#if idx > 0 && conv.createdBy !== userId && list[idx - 1].createdBy === userId}
            <span class="side_list_section">Compartidas</span>
            {/if}
            <li class="side_list_item">
                <a class="side_list_link" on:click={clickOnLink} href={`conversations/${conv.sid}`}>
                    <span class="item_name">
                        {conv.friendlyName}
                    </span>
                    <span class="item_date">
                        {conv.dateCreated?.toLocaleString("es-ES")}
                    </span>
                </a>
            </li>
            {/each}
        </ul>
    </div>
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
        background-color: var(--color-sea-blue);
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
        background-color: var(--color-gray-6);
        z-index: 100;
    }
    .side_list{
        display: flex;
        flex-direction: column;
    }
    .side_list_link{
        --color-text: inherit;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        gap: .3rem;
        padding: .5rem;
        transition: all .2s;
        position:relative;
        color: var(--color-text);
    }

    .side_list_link:hover{
        --color-text: white;
        background-color: var(--color-blue-gray);
    }
    .item_date{
        font-size: .7rem;
        color: var(--color-text);
    }
    .button_close{
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: transparent;
    }
    .button_close:hover{
        opacity: .5;
    }
    .side_list_section{
        padding-left: .5rem;
        display: block;
        padding-top: .5rem;
        padding-bottom: .5rem;
        font-weight: 600;
    }
    .side_list_section:nth-of-type(2){
        border-top: 1px solid var(--color-gray-4);
    }
</style>