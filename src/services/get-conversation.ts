import { getConversationClient } from "./get-client";

export const getConversation = async function(userId:string,conversationSid:string){
    const client = await getConversationClient(userId);
    const conversation = await client.getConversationBySid(conversationSid)

    return conversation
}