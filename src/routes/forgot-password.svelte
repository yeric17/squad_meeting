<script lang="ts">

import { supabase } from "$lib/supabase";
import { API_HOST } from "$utils/config";

    let email:string = ""

    async function sendMessageToRecovery(){
        if(email === "") return;
        const {data,error} = await supabase.auth.api.resetPasswordForEmail(email,{
            redirectTo: `${API_HOST}/reset-password`
        })

        if(error){
            throw new Error("error send message to reset password");
        }

        if(data == null) return;

        console.log(data)
    }
</script>

<form on:submit|preventDefault={sendMessageToRecovery}>
    <input type="email" bind:value={email} />
</form>