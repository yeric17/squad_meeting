<script lang="ts">
    // styles
    import "$css/reset.css";
    import "$css/variables.css";
    import "$css/buttons.css";
    import "$css/errors.css";
    import { setUser} from "../stores/sessionStore";
    import { supabase } from "$lib/supabase";
    import { onMount } from "svelte";
    import LoaderPage from "$lib/loader-page.svelte";
    import NotificationsContainer from "$lib/notifications-container.svelte";

    let loading = true;
    onMount(async()=>{
        loading = true;
        try{
            await setUser(supabase.auth.user())
        }
        catch(error){
            console.log(error)
        }
        finally{
            loading = false;
        }
    })

    supabase.auth.onAuthStateChange((_,session) => {
        if(session == null) return;
        if(session.user == null) return;
        setUser(session.user)
    })
</script>

<main id="app" class="main-container">
    {#if loading}
        <LoaderPage/>
    {:else}
    <slot></slot>
    {/if}
    <NotificationsContainer/>
</main>