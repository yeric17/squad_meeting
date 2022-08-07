

<script lang="ts">
    import { API_HOST } from "../../utils/config";

    import { onMount } from "svelte";
    import type { UserListInstanceCreateOptions } from "twilio/lib/rest/chat/v1/service/user";
    import LoaderPage from "$lib/loader-page.svelte";


    //const SUPABASE_JWT = import.meta.env.VITE_PUBLIC_SUPABASE_JWT;
    onMount(async()=>{
        const sectionsURL =  document.URL.replace('#','').split("/")
        const newURL = sectionsURL[sectionsURL.length - 1].replace('login-provider?','')

        const response = await fetch(`${API_HOST}/decode-token?${newURL}`,{method:'POST'})
        
        if(response.ok){
            const user = await response.json()

            const newTwilioUser:UserListInstanceCreateOptions = {
                identity: user?.id || user.email,
            }

            const resTwilio = await fetch(`${API_HOST}/twilio-users`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTwilioUser)
            })

            if(resTwilio.ok){
                console.log("Created user in twilio")
            }

            window.location.href = "/"
            return;
        }
        window.location.href = "/login"
    })
</script>

<section>
    <LoaderPage/>
</section>