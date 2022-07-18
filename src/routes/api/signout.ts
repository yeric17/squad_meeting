import { supabase } from "$lib/supabase";
import type { RequestHandler } from "@sveltejs/kit";
import { httpStatusCode } from "../../utils/http-status-codes";

export const get:RequestHandler = async () => {
    await supabase.auth.signOut();
    return {
        status: httpStatusCode.Ok,
    }
}