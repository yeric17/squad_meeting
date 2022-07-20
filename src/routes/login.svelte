<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';

    export const load:Load = async ({session,url}) => {
        const currentSession:any = session;

        const user = currentSession.user

        if(user == null){
            return{
                status: 200,
            }
        }
        if(user.logged_in){
            return {
                status: httpStatusCode.Found,
                redirect: "/",
            }
        }
        return {
            status:200,
        }
    }
</script>

<script lang="ts">
    //import { goto } from '$app/navigation';

    // components
    import SquadMeetingText from '$lib/svg/squad-meeting-text.svelte';
    import SquadMeetingLogo from '$lib/svg/squad-meeting-logo.svelte';
    import InputEmail from "$lib/form/input-email.svelte";
    import InputPassword from "$lib/form/input-password.svelte";
    import Spin from '$lib/spin.svelte';
    import { httpStatusCode } from '../utils/http-status-codes';
    import { supabase } from '$lib/supabase';
    import { API_HOST } from '../utils/config';
    //import { goto } from '$app/navigation';
    //import type { AppUser } from '../stores/user';




    let isValid = false;
    let isSubmit = false;
    let isLoading = false;
    let errorMessage = "";

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
        password: false
    }
    // handlers
    const handleSubmit = async () => {
        isLoading = true;
        isValid = validUser.email && validUser.password;
        isSubmit = true;

        if(!isValid){
            isLoading = false;
            return;
        } 

        const response = await fetch("api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginUser)
        })
        
        if(response.ok){
            console.log("goto in login")
            try{
                window.location.reload()
                //await goto("/")
            }
            catch(err){
                console.log(err)
            }
        }
        else {
            isLoading = false;
            isValid = false;
            errorMessage = "El correo electrónico o contraseña no son validos"
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
    <form class="login_form" on:submit|preventDefault={handleSubmit} class:valid={isValid}>
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
        <!-- <h4 class="login-with_form_title">
            Ingresar mediante
        </h4>
        <ul class="login-with_providers">
            <li class="providers_item"><button type="submit" class="providers_item_button" data-provider='google' on:click={loginWithGoogle}><img src="/google-button.png" alt="google button"/></button></li>
            <li class="providers_item"><button type="submit" class="providers_item_button" data-provider='github' on:click={loginWithGithub}><img src="/github-button.png" alt="github button"/></button></li>
        </ul> -->
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