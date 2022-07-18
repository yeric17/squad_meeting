import { supabase } from "$lib/supabase";
import type { RequestHandler } from "@sveltejs/kit";
import { httpStatusCode } from "../../utils/http-status-codes";

export const get:RequestHandler = async () => {
    const user = supabase.auth.user()
    
    console.log({user})
    return {
        status: httpStatusCode.Ok
    }

}