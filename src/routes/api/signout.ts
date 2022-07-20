import { getSupabaseClient, supabase } from "$lib/supabase";
import type { RequestHandler } from "@sveltejs/kit";
import { serialize } from "cookie";
import { httpStatusCode } from "../../utils/http-status-codes";

export const post:RequestHandler = async ({request}) => {
    let headers:Headers = new Headers();
    headers.set('set-cookie', serialize('_access_token','',{httpOnly:true,path:"/"}))
    return {
        status: httpStatusCode.Ok,
        headers: headers
    }
}