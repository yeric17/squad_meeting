<script lang="ts">
import AvatarAdd from "./avatar-add.svelte";
import { supabase } from "./supabase";


    let findValue:string|null = null;
    let listUsers:any[]=[]
    async function handleInput(){
        if(findValue == null) return
        const {data} = await supabase.from('profiles').select().textSearch('user_name',findValue)
        if(data == null) return;
        listUsers = data;
    }
</script>

<section class="add-user">
    <form class="add-user_form" on:submit|preventDefault={handleInput}>
        <input type="text" class="add-user_find" on:input={handleInput} bind:value={findValue}>
    </form>
    <ul>
        {#each listUsers as user}
            <li><AvatarAdd user={user}/></li>
        {/each}
    </ul>
</section>