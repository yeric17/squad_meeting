import type { RequestHandler } from "@sveltejs/kit";
import { httpStatusCode } from "../../utils/http-status-codes";
import AccessToken, { ChatGrant } from "twilio/lib/jwt/AccessToken";

const TWILIO_ACCOUNT_SID = import.meta.env.VITE_PUBLIC_ACCOUNT_SID;
const TWILIO_API_KEY= import.meta.env.VITE_PUBLIC_API_KEY;
const TWILIO_API_SECRET=import.meta.env.VITE_PUBLIC_API_SECRET;
const TWILIO_SERVICE_SID = import.meta.env.VITE_PUBLIC_SERVICE_SID;

export const get:RequestHandler = async ({url}) => {

    const identity = url.searchParams.get('identity')

    if(identity == null) {
        return {
            status: httpStatusCode.BadRequest,
            body: {
                message: "identity is required in query"
            }
        }
    }

    const accessToken = new AccessToken(
        TWILIO_ACCOUNT_SID,
        TWILIO_API_KEY,
        TWILIO_API_SECRET,
        {
            identity:identity
        }
    )

    const conversationGrant = new ChatGrant({
        serviceSid: TWILIO_SERVICE_SID
    })

    accessToken.addGrant(conversationGrant)

    

    return {
        status: httpStatusCode.Ok,
        body: accessToken.toJwt()
    }
}