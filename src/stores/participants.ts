import { writable } from "svelte/store";
import type { AppUser } from "$utils/types";

let newSupabaseUsers:AppUser[] = [];

export const conversationParticipants = writable(newSupabaseUsers)


export const setParticipants = (participants:AppUser[]) => {
    conversationParticipants.set(participants)
}