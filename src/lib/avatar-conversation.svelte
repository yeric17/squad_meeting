<script lang="ts">
    import type { Participant } from "@twilio/conversations";
    import { onMount } from "svelte";
    import { supabase } from "./supabase";

    export let participant:Participant;

    let loading = true;

    let user:any ={
        user_name:"",
        avatar:""
    };
    onMount( async()=>{
        const {data, error} = await supabase.from('profiles').select().eq('id',participant.identity)

        if(data && data.length > 0){
            user = data[0]
            console.log(user)
        }
        loading = false
    })

</script>



<div class="avatar">
    {#if !loading}
    <span class="avatar_image">
        <img src={user.avatar_url} alt="avatar">
    </span>
    <span class="avatar_name">
        {user.user_name}
    </span>
    {/if}
</div>

<style>
    .avatar{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        padding: .5rem;
        background-color: rgba(0,0,0,.1);
        border-radius: 6px;
    }
    .avatar_name{
        font-size: .9rem;
        max-width: 150px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
        color: var(--color-dark-purple);
        font-weight: 600;
    }
    .avatar_image img{
        width: 30px;
        border-radius: 30px;
        border: 1px solid var(--color-blue-gray);
    }
</style>