import type { Message, Participant } from "@twilio/conversations"

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

export type AppUser = {
    id: string,
    name: string,
    email: string,
    avatar: string,
    participant?:Participant,
    logged_in: boolean
}

export type AppNotificationType = 'error' | 'alert' | 'success' | 'info'

export type AppNotification = {
    title:string,
    message:string,
    type:AppNotificationType
}
