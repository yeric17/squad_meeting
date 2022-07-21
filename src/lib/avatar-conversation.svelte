<script lang="ts">


    export let participant:any;
    export let isOwner = false;




</script>



<div class="avatar">
    <span class="avatar_image">
        <img src={participant.avatar_url} alt="avatar">
    </span>
    <span class="avatar_name">
        <span>{participant.user_name}</span>
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
    .avatar_image img{
        width: 30px;
        border-radius: 30px;
        border: 1px solid var(--color-blue-gray);
    }
    .avatar_role{
        color: var(--color-sea-blue);
    }

</style>