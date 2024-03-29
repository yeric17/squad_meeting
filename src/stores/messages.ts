import type{ Message } from "@twilio/conversations";
import { writable } from "svelte/store";

let newMessageList:Message[] = []


export const messageList = writable(newMessageList)

export const addMessageToList = (message:Message) => {
    messageList.update(value=>{
        if(value.includes(message)) return value;
        let newValue = [...value,message]
        return newValue
    })
}

export const addMessagesToList = (messages:Message[]) => {
    messageList.update(value =>{
        let newValue = [...value, ...messages]
        return newValue
    })
}

let newReplyMessage:any = null;

export const replyMessage = writable(newReplyMessage)