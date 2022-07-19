<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';

    export const load:Load = async ({session}) => {

        console.log(session)
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
    import { goto } from '$app/navigation';
    import type { AppUser } from '../stores/user';




    let isValid = false;
    let isSubmit = false;
    let isLoading = false;

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
        }
        
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<section class="login-container">
    <div class="login_header">
        <SquadMeetingLogo/>
    </div>
    <form class="login_form" on:submit|preventDefault={handleSubmit} class:valid={isValid} class:error={!isValid && isSubmit}>
        <h1 class="login_title">Login</h1>
        <div class="login_email">
            <InputEmail bind:value={loginUser.email} bind:isValid={validUser.email}/>
        </div>
        <div class="login_password">
            <InputPassword bind:value={loginUser.password} bind:isValid={validUser.password} validateInput={false}></InputPassword>
            
        </div>
        {#if !isValid && isSubmit}
            <div class="login_error">
                Error al validar el usuario
            </div>
        {/if}
        <button type="submit" class="button button-main" disabled={!(validUser.password && validUser.email)}>
            {#if isLoading}
            <Spin/>
            {:else}
            Ingresar
            {/if}
        </button>
        <a href="/register" class="login_link">Registrarse</a>
    </form>
    <div class="login_footer">
        <SquadMeetingText/>
    </div>
</section>

<style>
    .login-container{
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto 1fr auto;
        justify-items: center;
        align-items: start;
        min-height: 100vh;
        padding-top: 1rem;
        padding-bottom: 1rem;
        gap: 3rem;
    }

    .login_header, .login_footer{
        width: 200px;
        align-self: end;
    }

    .login_form{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }
    .login_title{
        color: var(--color-dark-purple);
        font-size: 2rem;
        padding-bottom: 1rem;
    }
    .login_link{
        font-size: .8rem;
        color: var(--color-purple);
    }
    .login_email, .login_password{
        width: 300px;
    }
    
</style>