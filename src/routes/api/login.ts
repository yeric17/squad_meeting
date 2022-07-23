import type { RequestHandler } from "@sveltejs/kit"
import { httpStatusCode } from "../../utils/http-status-codes";
import { supabase, type UserCredentials } from "../../lib/supabase";
import { handleError } from "../../utils/handler-errors";


export const post: RequestHandler = async ({request}) => {
    const jsonData : UserCredentials = await request.json();

    const userLogin : UserCredentials = jsonData;
    try {
        const {error} = await supabase.auth.signIn(userLogin)
    
        if(error){
            return handleError(httpStatusCode.Unauthorized, error.message)        
        }
    }
    catch(err){
        console.log(err)
        return handleError(httpStatusCode.InternalServerError, "")
    }
    finally{

        return {
            status: httpStatusCode.Ok,
        }
    }
}
