import { API_HOST } from "$utils/config";
import { Client } from "@twilio/conversations";

export const getConversationClient = async function(userID:string) {
    const accesTokenResponse = await fetch(`${API_HOST}/access-token?identity=${userID}`);
    if (!accesTokenResponse.ok) {
        throw new Error("Error on get access token");
    }

    const accesToken = await accesTokenResponse.text();

    const client = new Client(accesToken);

    return client
}