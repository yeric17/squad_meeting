
import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import pkg from 'jsonwebtoken';
import type { AppUser } from './stores/user';

const SUPABASE_JWT = import.meta.env.VITE_PUBLIC_SUPABASE_JWT;
const {verify} = pkg;

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
    
    if(event.url.pathname.startsWith("/api/signout")){
        console.log(event.request)
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
                avatar: "",
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