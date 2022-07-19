
import { supabase } from "$lib/supabase";
import type { RequestHandler } from "@sveltejs/kit"
import { verify } from "jsonwebtoken";
import { parse, serialize } from "cookie";
import { httpStatusCode } from "../../utils/http-status-codes";
import { handleError } from "../../utils/handler-errors";
import type { Session } from "@supabase/supabase-js";
import type { AppUser } from "src/stores/user";



export const get: RequestHandler = async({request}) =>{

    // const cookie = request.headers.get('cookie')
    // let supabaseSession = supabase.auth.session()

    // console.log(supabaseSession)
    // if(cookie == null){
    //     console.log("No existe cookie")
    //     return handleError(httpStatusCode.Unauthorized, "Not found cookies")
    // }

    // const cookieParsed = parse(cookie)
    
    
    // const accessToken = cookieParsed._access_token
    // const refreshToken = cookieParsed._refresh_token

    // if(accessToken == null) {
    //     console.log("No existe access token")
    //     return handleError(httpStatusCode.Unauthorized, "Not found an _access_token")
    // }

    // let validToken:any|null = null;
    // let headers:Headers = new Headers;

    let user:AppUser = {
        id: "",
        name: "",
        email: "",
        avatar: "",
        logged_in: false,
    }

    // try {
    //     validToken = verify(accessToken, import.meta.env.VITE_PUBLIC_SUPABASE_JWT)
    // }
    // catch(err){
    //     console.log("Acces token expiro")
    //     if(refreshToken == null){
    //         console.log("No existe refresh token")
    //         return handleError(httpStatusCode.Unauthorized, "token expired")
    //     }
        
    //     const {session, error} = await supabase.auth.signIn({email:"yeric17@gmail.com"})

    //     if(error || session == null){
    //         console.log("Error al hacer singin con refresh token")
    //         return handleError(httpStatusCode.InternalServerError, "")
    //     }
    //     headers.append(
    //         'set-cookie',
    //         serialize('_refresh_token', session.refresh_token?session.refresh_token:"",
    //         {
    //             httpOnly: true,
    //             path:"/"
    //         })
    //     )
    //     headers.append(
    //         'set-cookie',
    //         serialize('_access_token', session.access_token,
    //         {
    //             httpOnly: true,
    //             path:"/"
    //         })
    //     )
        
    //     const sessionUser = session.user;

    //     if(sessionUser){
    //         user.id = sessionUser.id,
    //         user.email = sessionUser.email?sessionUser.email:"",
    //         user.name = sessionUser.user_metadata.name,
    //         user.logged_in = true;
    //     }
    //     return {
    //         status: 200,
    //         body: JSON.stringify(user)
    //     }
    // }
    
    // console.log("usa valid token")
    // if(validToken){
    //     user.email = validToken.email
    //     user.name = validToken.app_metadata.name
    //     user.id = validToken.sub
    //     user.logged_in = true
    // }

    return {
        status: 200,
        body: JSON.stringify(user)
    }
}