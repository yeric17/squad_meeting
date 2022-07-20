<script lang="ts">
    import { fade } from "svelte/transition";

    import { API_HOST } from "../utils/config";
    import { clickOutside } from "./click-outside";
    import UserSquareIcon from "./svg/user-square-icon.svelte";
    import LogoutIcon from "./svg/logout-icon.svelte";


    import { supabase } from "./supabase";


    export let userName:string = "";
    export let avatar:string = "";
    export let namePosition:string = "left";
    export let color:string = "#F2994A";

    let showMenu = false;

    function toggleShowMenu(){
        showMenu = !showMenu
    }

    async function signOut(){
        await fetch(`${API_HOST}/signout`,{method:'POST'})
        window.location.href = '/login'
    }
    

    function handleClickOutside(){
        showMenu = false;
    }
</script>



<div class="identity" use:clickOutside on:click-outside={handleClickOutside} on:click={toggleShowMenu}>
    {#if namePosition === "left"}
    <span class="identity_name">{userName}</span>
    {/if}
    <span class="identity_avatar" style={`--color-avatar:${color};`} >
        {#if avatar !== ""}
        <img src={avatar} alt={userName}>
        {:else}
        <span class="avatar_letter">{userName.charAt(0)}</span>
        {/if}
    </span>
    {#if namePosition === "right"}
    <span class="identity_name">{userName}</span>
    {/if}
    {#if showMenu}
        <div class="menu" transition:fade={{duration:100}}>
            <ul class="menu_list">
                <li class="menu_item">
                    <button on:click={signOut}>
                        <span class="menu_item_icon">
                            <LogoutIcon/>
                        </span>
                        <span class="menu_item_text">
                            Cerrar sesión
                        </span>
                    </button>
                </li>
                <!-- <li class="menu_item">
                    <a href="/profile">
                        <span class="menu_item_icon">
                            <UserSquareIcon/>
                        </span>
                        <span class="menu_item_text">
                            Perfil
                        </span>
                    </a>
                </li> -->
            </ul>
        </div>
    {/if}
</div>

<style>
    .identity{
        position: relative;
        user-select: none;
        cursor: pointer;
    }
    .identity_avatar {
        background-color: var(--color-avatar);
        display: inline-flex;
        width: 30px;
        height: 30px;
        justify-content: center;
        align-items: center;
        color: white;
        border-radius: 30px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
    }
    .identity_name{
        font-weight: 400;
        font-size: .9rem;
    }
    .menu{
        position: absolute;
        right: 0;
        bottom: -.6rem;
        transform: translateY(100%);
        background-color: var(--color-gray-6);
        min-width: 150px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        z-index: 100;
        overflow: hidden;
    }
    .menu_list{
        width: 100%;
    }
    .menu_item{
        display: block;
        
        width: 100%;
    }
    .menu_item button{
        color: var(--color-text);
        border: none;
        display: flex;
        background-color: transparent;
        width: 100%;
        cursor: pointer;
        padding: .5rem;
        text-align: left;
        font-size: .8rem;
        align-items: center;
        gap: .5rem;
    }
    .menu_item button:hover{
        --color-text: white;
        background-color: var(--color-soft-purple);
        color: var(--color-text);
        
    }
    .menu_item_icon{
        width: 1rem;
        height: 1rem;
    }

</style>