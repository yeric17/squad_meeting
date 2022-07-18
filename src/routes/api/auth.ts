
import { supabase } from "$lib/supabase";
import type { RequestHandler } from "@sveltejs/kit"
import type { AppUser } from "src/stores/user";
import { httpStatusCode } from "../../utils/http-status-codes";


export const post: RequestHandler = async() =>{

    const lastSession = supabase.auth.session()

    const {session} = await supabase.auth.signIn({
        refreshToken: lastSession?.refresh_token
    })

    if(session == null){
        return {
            status: httpStatusCode.Unauthorized
        }
    }
    const user = session.user;

    if(user == null){
        return {
            status: httpStatusCode.InternalServerError
        }
    }
    

    if(user.aud === 'authenticated'){
        const appUser:AppUser = 
            {
                id: user.id,
                email: user.email?user.email:"",
                name: user.user_metadata.name,
                avatar: "",
                logged_in: true
            }
        
        return {
            status:200,
            body:JSON.stringify(appUser)
        }
    }
    return {
        status: 401
    }
}