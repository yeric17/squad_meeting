<script lang="ts">

    // components
    import SquadMeetingText from '$lib/svg/squad-meeting-text.svelte';
    import SquadMeetingLogo from '$lib/svg/squad-meeting-logo.svelte';
    import InputEmail from "$lib/form/input-email.svelte";
    import InputPassword from "$lib/form/input-password.svelte";
    import Spin from '$lib/spin.svelte';
    import { supabase } from '$lib/supabase';
    import { API_HOST } from '$utils/config';
    import { user } from '$stores/sessionStore';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';


    let isValid = false;
    let isSubmit = false;
    let isLoading = false;
    let errorMessage = "";

    onMount(async()=>{
        if($user.logged_in){
            await goto("/")
        }
    })

    type LoginUser = {
        email:string,
        password:string
    }

    const loginUser:LoginUser = {
        email: "",
        password: ""
    }

    const validUser = {
        email: false,
        password: false,
        test: function (){
            return this.email && this.password
        }
    }


    // handlers
    const handleLogin = async () => {
        if(!validUser.test()) return;
        try{
            isLoading = true
            const {error} = await supabase.auth.signIn({
                email: loginUser.email,
                password: loginUser.password
            })
            if(error){
                isValid = false
                errorMessage = error.message
            }
            window.location.href = "/"
        }
        catch(error){
            console.log(error)
            isValid = false;
            errorMessage = "Estamos presentando un error interno, intentalo mas tarde"
        }
        finally{
            isLoading = false;
        }
    }
    async function loginWithGoogle(){
        await supabase.auth.signIn({
            provider: 'google',
        }, 
        {
            redirectTo: `${API_HOST}/login-provider?`
        })
    }

    async function loginWithGithub(){
        await supabase.auth.signIn({
            provider: 'github',
        }, 
        {
            redirectTo: `${API_HOST}/login-provider?`
        })
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>


<section class="login-container">

    <div class="login_header">
        <SquadMeetingLogo/>
    </div>
    <form class="login_form" on:submit|preventDefault={handleLogin} class:valid={isValid}>
        <h1 class="login_title">Login</h1>
        <div class="login_email">
            <InputEmail bind:value={loginUser.email} bind:isValid={validUser.email}/>
        </div>
        <div class="login_password">
            <InputPassword bind:value={loginUser.password} bind:isValid={validUser.password} validateInput={false}></InputPassword>
            
        </div>
        {#if !isValid && isSubmit}
            <span class="error-message">
                {errorMessage}
            </span>
        {/if}
        <button type="submit" class="button button-main" disabled={!(validUser.password && validUser.email)}>
            {#if isLoading}
            <Spin/>
            {:else}
            Ingresar
            {/if}
        </button>
    </form>
    <div class="login-with_form">
        <h4 class="login-with_form_title">
            Ingresar mediante
        </h4>
        <ul class="login-with_providers">
            <li class="providers_item"><button type="submit" class="providers_item_button" data-provider='google' on:click={loginWithGoogle}><img src="/google-button.png" alt="google button"/></button></li>
            <li class="providers_item"><button type="submit" class="providers_item_button" data-provider='github' on:click={loginWithGithub}><img src="/github-button.png" alt="github button"/></button></li>
        </ul>
    </div>
    <a href="/register" class="login_link">Crear nueva cuenta</a>
    <div class="login_footer">
        <SquadMeetingText/>
    </div>
</section>


<style>
    .login-container{
        display: grid;
        justify-items: center;
        align-items: start;
        min-height: 100vh;
        padding-top: 1rem;
        padding-bottom: 1rem;
        gap: 1rem;
    }

    .login_header, .login_footer{
        width: 200px;
        align-self: end;
    }

    .login_form{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }
    .login_title{
        color: var(--color-dark-purple);
        font-size: 2rem;
        
    }
    .login_link{
        font-size: .9rem;
        font-weight: 600;
        color: var(--color-purple);
    }
    .login_link:hover{
        text-decoration: underline;
    }
    .login_email, .login_password, .error-message{
        width: 300px;
    }
    .login-with_form_title{
        padding-bottom:1rem;
        color: var(--color-gray-3);
    }
    .providers_item_button{
        border: none;
        border-radius: 50%;
        display: flex;
        cursor: pointer;
    }
    .providers_item_button img{
        pointer-events: none;
    }
    .login-with_providers{
        display: flex;
        justify-content: space-between;
        
    }
</style>