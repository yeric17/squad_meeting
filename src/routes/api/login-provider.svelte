

<script lang="ts">
    import { API_HOST } from "../../utils/config";

    import { onMount } from "svelte";


    //const SUPABASE_JWT = import.meta.env.VITE_PUBLIC_SUPABASE_JWT;
    onMount(async()=>{
        const sectionsURL =  document.URL.replace('#','').split("/")
        const newURL = sectionsURL[sectionsURL.length - 1].replace('login-provider?','')

        const reaponse = await fetch(`${API_HOST}/decode-token?${newURL}`,{method:'POST'})
        
        if(reaponse.ok){
            window.location.href = "/"
            return;
        }
        window.location.href = "/login"
    })
</script>

<section>
    Redirecting
</section>