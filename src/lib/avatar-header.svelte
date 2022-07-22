<script lang="ts">
    import Avatar from "./avatar.svelte";
    import { clickOutside } from "./click-outside";
    import ProfileMenu from "./profile-menu.svelte";


    export let userName:string = "";
    export let avatar:string = "";
    export let namePosition:string = "left";
    export let color:string = "#F2994A";

    let showMenu = false;

    function toggleShowMenu(){
        showMenu = !showMenu
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
        <Avatar avatar_url={avatar} size="100%"/>
    </span>
    {#if namePosition === "right"}
    <span class="identity_name">{userName}</span>
    {/if}
    <ProfileMenu showMenu={showMenu}/>
</div>

<style>
    .identity{
        position: relative;
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: .25rem;
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

  

</style>