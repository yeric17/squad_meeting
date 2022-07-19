import { supabase } from '$lib/supabase';
import type { GetSession, Handle } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';
import { verify } from 'jsonwebtoken';
import type { AppUser } from './stores/user';

const SUPABASE_JWT = import.meta.env.VITE_PUBLIC_SUPABASE_JWT;

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
    
    console.log(`request: ${event.request.method}\t| origin:${event.url.origin}\t -> href:${event.url.href}`)
    const response = await resolve(event);

    return response;
}


export const getSession: GetSession = async (event) =>{
    let sessionUser:AppUser = {
        id: "",
        name: "",
        email: "",
        avatar: "",
        logged_in: false,
    }

    // const request = event.request;
    // const cookie = request.headers.get('cookie')

    // if(cookie == null){
    //     return {
    //         user: sessionUser
    //     }
    // }
    
    // const cookieParsed = parse(cookie)

    // const accessToken = cookieParsed._access_token;

    const session = supabase.auth.session()

    console.log(session)
    if(session == null || session.user == null){
        return {
            user:sessionUser
        }
    }
    
    sessionUser = {
        id: session.user.id,
        name: session.user.user_metadata.name,
        avatar: "",
        email: session.user.email?session.user.email:"",
        logged_in: true
    }

    return {
        user:sessionUser
    }

}