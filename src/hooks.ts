import type { Handle } from '@sveltejs/kit';



/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
    
    console.log(`request: ${event.request.method}\t|  ${event.url.pathname}`)

    const response = await resolve(event);

    return response;
}
