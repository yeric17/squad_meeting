import type { Conversation, Message, Paginator } from "@twilio/conversations";

export const getMessagePaginator = async function(conversation:Conversation,amount:number){
    let paginator = {} as Paginator<Message>
    try{
        paginator = await conversation.getMessages(amount,undefined,'backwards')
    }
    catch(error){
        console.log(error)
        throw new Error("Can not get Messages");
    }
    finally{
        return paginator
    }
}