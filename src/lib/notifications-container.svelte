<script lang='ts'>
    
    import { notifications } from "$utils/notifications";
    import Notification from "./notification.svelte";
</script>

<section class="notifications">
    {#if $notifications.length > 0}
        {#each $notifications as notification, idx (idx)}
            <Notification notification={notification}/>
        {/each}
    {/if}
</section>

<style>
    .notifications{
        position:fixed;
        display: grid;
        gap: .5rem;
        z-index: 1000;
        right: 2rem;
        bottom: 2rem;
    }
</style>