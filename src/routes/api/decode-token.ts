import { supabase } from "$lib/supabase";
import type { RequestHandler } from "@sveltejs/kit";
import { serialize } from "cookie";
import { httpStatusCode } from "../../utils/http-status-codes";


export const post:RequestHandler = async({url})=>{
    const token = url.searchParams.get('refresh_token')
    
    if(token == null){
        return {
            status:httpStatusCode.Unauthorized
        }
    }
    const {session} = await supabase.auth.signIn({refreshToken:token})
    
    if(session == null){
        return {
            status:httpStatusCode.Unauthorized
        }
    }

    let headers:Headers = new Headers;

    headers.append(
        'set-cookie',
        serialize('_access_token', session.access_token,
        {
            httpOnly: true,
            path:"/"
        })
    )
    return {
        status: httpStatusCode.Ok,
        headers: headers
    }
}