import type { RequestHandler } from "@sveltejs/kit"
import { createClient } from "@supabase/supabase-js"

import type { UserListInstanceCreateOptions } from "twilio/lib/rest/conversations/v1/user"
import { httpStatusCode } from "../../utils/http-status-codes"
import { API_HOST } from "../../utils/config"




const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

type UserRegister = {
    name: string,
    email: string,
    password: string
}

export const post: RequestHandler = async ({request}) => {
    const jsonData = await request.json();
    
    const userRegister : UserRegister = jsonData;
    
    const { user } = await supabase.auth.signUp(
        {
            email: userRegister.email,
            password: userRegister.password
        },
        {
            data: {
                name: userRegister.name
            }
        }
    )
        
    if(user == null) return {status: httpStatusCode.BadRequest}

    const newTwilioUser:UserListInstanceCreateOptions = {
        friendlyName: userRegister.name,
        identity: user?.id || userRegister.email,
        attributes: JSON.stringify({
            name: userRegister.name,
            email: userRegister.email
        })
    }

    
    const resTwilio = await fetch(`${API_HOST}/twilio-users`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTwilioUser)
    })

    console.log("Twilio:", resTwilio)
    return {
        status: 200
    }

}