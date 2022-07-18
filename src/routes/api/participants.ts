import { twilioClient, TWILIO_SERVICE_SID } from "$lib/twilio-client";
import type { RequestHandler } from "@sveltejs/kit";
import { httpStatusCode } from "../../utils/http-status-codes";

export const post:RequestHandler = async ({request}) => {
    const requestOpt = await request.json()
    if(requestOpt.conversationSid == null || requestOpt.participant == null){
        return {
            status: httpStatusCode.BadRequest
        }
    }    

    const participantInstance = await twilioClient.conversations.v1.services(TWILIO_SERVICE_SID).conversations(requestOpt.conversationSid).participants.create(requestOpt.participant)

    console.log({participantInstance})

    return {
        status: httpStatusCode.Ok,
        body: JSON.stringify(participantInstance)
    }
}