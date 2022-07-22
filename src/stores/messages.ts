import type { Message } from "@twilio/conversations";
import { writable } from "svelte/store";

let newMessageList:Message[] = []


export const messageList = writable(newMessageList)