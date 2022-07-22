import type { Message } from "@twilio/conversations"

export type User = {
    name: string,
    email: string,
    avatar: string,
    logged_in: boolean
}


export type MessageContent = {
    body:string,
    author:string,
    dateCreated:Date,
    twilioMessage:Message
}
