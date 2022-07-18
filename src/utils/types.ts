export type User = {
    name: string,
    email: string,
    avatar: string,
    logged_in: boolean
}

type ReplyMessage = {
    text:string,
    messageSid:string,
}

export type MessageContent = {
    text: string,
    replyMessage:ReplyMessage|null,
}
