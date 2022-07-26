
import type { Handle } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
    
    console.log(`request: ${event.request.method}\t| origin:${event.url.origin}\t -> href:${event.url.href}`)
  
    const response = await resolve(event);
    return response;
}