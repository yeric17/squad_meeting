
import { supabase } from '$lib/supabase';
import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import type { AppUser } from './stores/user';

const SUPABASE_JWT = import.meta.env.VITE_PUBLIC_SUPABASE_JWT;
const {verify} = jwt;

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
    
    console.log(`request: ${event.request.method}\t| origin:${event.url.origin}\t -> href:${event.url.href}`)
  
    const response = await resolve(event);
    return response;
}


export const getSession: GetSession = async (event) =>{
    const sessionUser = event.locals.user;
    return {
        user:sessionUser,
    }
}