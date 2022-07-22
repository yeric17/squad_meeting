
import { Conversation } from "@twilio/conversations";
import { writable } from "svelte/store";

let newConversation:Conversation = Conversation.prototype

export const activeConversation = writable(newConversation)