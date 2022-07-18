<svelte:head>
    <title>Sign Up</title>
</svelte:head>

<script context="module" lang="ts">

    import type { Load } from '@sveltejs/kit';
    

    export const load:Load = async ({session}) => {
        const authResponse = await fetch(`${API_HOST}/auth`, {method:'POST'})

        if(authResponse.ok){
            const user = await authResponse.json()

            if(user.logged_in){
                return {
                    status: httpStatusCode.MovedPermanently,
                    redirect: "/"
                }
            }
        }
        return {
            status:200,
        }
    }
</script>

<script lang="ts">
    

    // components
    import SquadLogo from '$lib/squad-logo.svelte';
    import InputEmail from "$lib/form/input-email.svelte";
    import InputPassword from "$lib/form/input-password.svelte";
    import InputText from "$lib/form/input-text.svelte";
    import { goto } from '$app/navigation';
    import { API_HOST } from '../utils/config';
import { httpStatusCode } from '../utils/http-status-codes';



    let isValid = false;
    let isSubmit = false;

    type RegisterUser = {
        name: string,
        email:string,
        password:string

    }

    const registerUser:RegisterUser = {
        name: "",
        email: "",
        password: "",
    }

    const validUser = {
        name: false,
        email: false,
        password: false
    }
    // handlers
    async function submitHandler(){
        isValid = validUser.email && validUser.password && validUser.name;
        isSubmit = true;
        if(!isValid) return;

        const response = await fetch(`${API_HOST}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerUser)
        })

        if(response.ok){
            await goto("/login")
        }
        else {
            isValid = false;
        }

    }
</script>

<section class="login-container">
    <div class="login_header">
        <SquadLogo/>
    </div>
    <form class="login_form" on:submit|preventDefault={submitHandler} class:valid={isValid} class:error={!isValid && isSubmit}>
        <div class="login_name">
            <InputText placeholder="Nombre" bind:value={registerUser.name} bind:isValid={validUser.name}></InputText>
        </div>
        <div class="login_email">
            <InputEmail bind:value={registerUser.email} bind:isValid={validUser.email}/>
        </div>
        <div class="login_password">
            <InputPassword bind:value={registerUser.password} bind:isValid={validUser.password}></InputPassword>
        </div>
        {#if !isValid && isSubmit}
            <div class="login_error">
                Error al validar el usuario
            </div>
        {/if}
        <button type="submit" class="button button-secondary">Crear</button>
    </form>
    
</section>

<style>
    .login_header{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        max-width: 200px;
        margin-left: auto;
        margin-right: auto;
        padding-top: 2rem;
    }
    /* .login_title{
        font-weight: 600;
        font-size: 1.8rem;
        color: var(--color-sea-blue);
    } */
    .login_form{
        padding-top: 4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }
    .login_email, .login_password, .login_name{
        max-width: 300px;
        width: 100%;
    }
    
</style>