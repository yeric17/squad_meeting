
import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import type { AppUser } from './stores/user';

const SUPABASE_JWT = import.meta.env.VITE_PUBLIC_SUPABASE_JWT;
const {verify} = jwt;

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
    
    console.log(`request: ${event.request.method}\t| origin:${event.url.origin}\t -> href:${event.url.href}`)
    
    
    let sessionUser:AppUser = {
        id: "",
        name: "",
        email: "",
        avatar: "",
        logged_in: false,
    }
    //console.log(event.request)
    
    if(event.url.pathname.startsWith("/api/signout") || event.url.pathname.startsWith("/api/login") && event.request.method === 'POST'){
        const response = await resolve(event);
        return response;
    }


    const cookie = event.request.headers.get('cookie')

    if(cookie){
        const parsedCookie = parse(cookie)
        const accessToken = parsedCookie._access_token;

        try{
            const verifiedToken:any = verify(accessToken, SUPABASE_JWT)

            let tempUser = {
                id: verifiedToken.sub,
                email: verifiedToken.email,
                name: verifiedToken.user_metadata.name,
                avatar: verifiedToken.user_metadata.avatar_url,
                logged_in: true
            }

            sessionUser = tempUser;
            event.locals.user = sessionUser
            const response = await resolve(event);
            return response
        }
        catch(err){
            console.log(err)
        }
    }

    
    event.locals.user = sessionUser;


  
    const response = await resolve(event);
    return response;
}


export const getSession: GetSession = async (event) =>{
    const sessionUser = event.locals.user;
    return {
        user:sessionUser,
    }

}