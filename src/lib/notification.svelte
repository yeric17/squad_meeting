<script lang="ts">
    import type { AppNotification } from "$utils/notifications";
    import {fly} from 'svelte/transition'

    export let notification:AppNotification;
</script>


<div class="notification" in:fly={{y:-200}} out:fly={{y:200}}
class:error={notification.type === 'error'}
class:alert={notification.type === 'alert'}
class:info={notification.type === 'info'}
class:success={notification.type === 'success'}
>
    <h6 class="notification_title">
        {notification.title}
    </h6>
    <div class="notification_body">
        {notification.message}
    </div>
</div>


<style>
    .notification{
        display: grid;
        gap: .5rem;
        background-color: white;
        max-width: 240px;
        border-radius: 5px;
    }
    .notification_title{
        padding: .5rem;
        font-size: 1rem;
        font-weight: 500;
        padding-bottom: 0;
    }
    .notification_body{
        font-size: .9rem;
        padding: .5rem;
        border-top: 1px solid var(--color-sea-blue);
    }
</style>