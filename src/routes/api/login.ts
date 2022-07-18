import type { RequestHandler } from "@sveltejs/kit"
import { httpStatusCode } from "../../utils/http-status-codes";
import { supabase, type UserCredentials } from "../../lib/supabase";
import { appUser} from "../../stores/user";


export const post: RequestHandler = async ({request}) => {
    const jsonData : UserCredentials = await request.json();

    const userLogin : UserCredentials = jsonData;

    const {session} = await supabase.auth.signIn(userLogin)
    
    if(session == null){
        return {
            status: httpStatusCode.Unauthorized
        }
    }

    const user = session.user
    if(user == null){
        return {
            status: httpStatusCode.InternalServerError
        }
    }
    appUser.set({
            id: user.id,
            name: user.user_metadata.name,
            email: user.email?user.email:"",
            avatar: "",
            logged_in: true
        })
    return {
        status: httpStatusCode.Ok,
    }

}