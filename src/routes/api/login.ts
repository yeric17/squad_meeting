import type { RequestHandler } from "@sveltejs/kit"
import { httpStatusCode } from "../../utils/http-status-codes";
import { supabase, type UserCredentials } from "../../lib/supabase";
import { serialize } from "cookie";
import { handleError } from "../../utils/handler-errors";


export const post: RequestHandler = async ({request}) => {
    const jsonData : UserCredentials = await request.json();

    const userLogin : UserCredentials = jsonData;

    const {session, error} = await supabase.auth.signIn(userLogin)

    if(error != null){
        return handleError(httpStatusCode.Unauthorized, error.message)        
    }
    
    if(session == null){
        return handleError(httpStatusCode.Unauthorized, "Can not create a session for user")  
    }

    const user = session.user
    if(user == null){
        return handleError(httpStatusCode.InternalServerError, "Can not get a user from session") 
    }


    if(session.refresh_token == undefined){
        return handleError(httpStatusCode.InternalServerError, "Can not get a user refresh token from session") 
    }

    let headers:Headers = new Headers;
    // headers.append(
    //     'set-cookie',
    //     serialize('_refresh_token', session.refresh_token,
    //     {
    //         httpOnly: true,
    //         path:"/"
    //     })
    // )
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
