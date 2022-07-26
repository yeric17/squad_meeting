<script lang="ts">
    import type { AppNotification } from "$utils/types";
    import {fly} from 'svelte/transition'
import AlertIcon from "./svg/alert-icon.svelte";
import ErrorIcon from "./svg/error-icon.svelte";
import FlagIcon from "./svg/flag-icon.svelte";
import SuccessIcon from "./svg/success-icon.svelte";

    export let notification:AppNotification;
</script>


<div class="notification" in:fly={{y:200,duration:600}} out:fly={{y:-200,duration:600}}
class:error={notification.type === 'error'}
class:alert={notification.type === 'alert'}
class:info={notification.type === 'info'}
class:success={notification.type === 'success'}
>
    <h6 class="notification_title">
        {#if notification.type === "error"}<span class="notification-icon"><ErrorIcon/></span>{/if}
        {#if notification.type === "alert"}<span class="notification-icon"><AlertIcon/></span>{/if}
        {#if notification.type === "info"}<span class="notification-icon"><FlagIcon/></span>{/if}
        {#if notification.type === "success"}<span class="notification-icon"><SuccessIcon/></span>{/if}
        <span class="notification_title_text">{notification.title}</span>
    </h6>
    <div class="notification_body">
        {notification.message}
    </div>
</div>


<style>
    .notification{
        display: grid;
        background-color: white;
        max-width: 240px;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,.2);
    }
    .notification_title{
        padding: .5rem;
        font-size: 1rem;
        font-weight: 500;
        color: white;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .notification_body{
        font-size: .9rem;
        padding: .5rem;
    }
    .notification_title_text{
        display: flex;
        height: 100%;
        align-items: center;
    }
    .notification-icon{
        display: flex;
        --color-text: white;
    }
    .notification.success .notification_title{
        background-color: var(--color-green);
    }
    .notification.error .notification_title{
        background-color: var(--color-red);
    }
    .notification.info .notification_title{
        background-color: var(--color-blue-gray);
    }
    .notification.alert .notification_title{
        background-color: var(--color-orange);
    }
</style>