import { twilioClient, TWILIO_SERVICE_SID } from "$lib/twilio-client";
import type { RequestHandler } from "@sveltejs/kit";
import { httpStatusCode } from "../../utils/http-status-codes";

export const get:RequestHandler =async ({url}) => {
    const uniqueName = url.searchParams.get('uniqueName')


    const conversations = await twilioClient.conversations.v1.services(TWILIO_SERVICE_SID).conversations.list()


    if(uniqueName == null)
    {
        return {
            status: httpStatusCode.Ok,
            body: JSON.stringify(conversations)
        }
    }

    const conversation = conversations.filter(conv => conv.uniqueName === uniqueName)[0]

    return {
        status: httpStatusCode.Ok,
        body: JSON.stringify(conversation)
    }

}