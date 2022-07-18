import type { RequestHandler } from "@sveltejs/kit";
import { httpStatusCode } from "../../utils/http-status-codes";
import type { UserListInstanceCreateOptions } from "twilio/lib/rest/conversations/v1/user";
import { twilioClient, TWILIO_SERVICE_SID } from "../../lib/twilio-client";


export const post:RequestHandler = async ({request}) => {
    const jsonData = await request.json()

    console.log("enter end point users")
    if(jsonData === null || jsonData === undefined){
        return {
            status: httpStatusCode.BadRequest,
        }
    }

    const userCreateOptions: UserListInstanceCreateOptions = {
        identity: jsonData.id,
        friendlyName: jsonData.friendlyName,
        attributes: JSON.stringify(jsonData.attributes),
    }
    let user;
    try {
        user = await twilioClient.conversations.v1.services(TWILIO_SERVICE_SID).users.create(userCreateOptions)
    }
    catch(err){
        console.log(err)
        return {
            status: httpStatusCode.InternalServerError,
        }
    }
    console.log({user})

    return {
        status: httpStatusCode.Ok,
        body: JSON.stringify(user)
    }
}
