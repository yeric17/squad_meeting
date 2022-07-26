<script lang="ts">
import type { AppUser } from "$utils/types";
import type { JSONObject } from "@twilio/conversations";

    import { onMount } from "svelte";

    import Avatar from "./avatar.svelte";

    export let participant:AppUser;
    export let isOwner = false;
    let online:boolean = false;


    onMount(()=>{
        updateStatus()
        participant.participant?.removeAllListeners()
        participant.participant?.on('updated',()=>{
            updateStatus()
        })
    })

    function updateStatus(){
        let str = participant.participant?.attributes as JSONObject

        if(str == null) return;
        
        console.log({str})
        if(str !== undefined && str !== null){
            online = str.status === 'online'
            return
        }
        online = false;
    }
</script>



<div class="avatar" class:online={online}>
    <Avatar avatar_url={participant.avatar}/>
    <span class="avatar_name">
        <span>{participant.name}</span>
       {#if isOwner}<span class="avatar_role">admin</span>{/if}
    </span>
</div>

<style>
    .avatar{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
        padding: .5rem;
        background-color: rgba(0,0,0,.1);
        border-radius: 6px;
        position: relative;
    }
    .avatar_name{
        font-size: .9rem;
        max-width: 150px;
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        color: var(--color-dark-purple);
        font-weight: 600;
    }

    .avatar_role{
        color: var(--color-sea-blue);
    }
    .avatar::after{
        content: "";
        display: block;
        position:absolute;
        right: 0;
        bottom: 0;
        width: .8rem;
        height: .8rem;
        border-radius: .8rem;
        transform: translate(25%,25%);
        background-color: var(--color-gray-3);
    }
    .avatar.online::after{
        background-color: var(--color-sea-blue);
    }
</style>