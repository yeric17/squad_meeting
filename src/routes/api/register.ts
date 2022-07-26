import type { RequestHandler } from "@sveltejs/kit"

import type { UserListInstanceCreateOptions } from "twilio/lib/rest/conversations/v1/user"
import { httpStatusCode } from "../../utils/http-status-codes"
import { API_HOST } from "../../utils/config"
import { getSupabaseClient } from "$lib/supabase"
import { getRandomAvatar } from "../../utils/user-theme"


type UserRegister = {
    name: string,
    email: string,
    password: string
}

export const post: RequestHandler = async ({request}) => {
    const jsonData = await request.json();
    
    const userRegister : UserRegister = jsonData;
    
    const { user, error } = await getSupabaseClient().auth.signUp(
        {
            email: userRegister.email,
            password: userRegister.password
        },
        {
            data: {
                user_name: userRegister.name,
                avatar_url: getRandomAvatar()
            }
        }
    )
        
    if(error) return {status: httpStatusCode.BadRequest}
    console.log(user)
    const newTwilioUser:UserListInstanceCreateOptions = {
        identity: user?.id || userRegister.email,
    }

    
    const resTwilio = await fetch(`${API_HOST}/twilio-users`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTwilioUser)
    })

    return {
        status: 200,
        body: JSON.stringify(resTwilio)
    }

}