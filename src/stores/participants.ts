import { writable } from "svelte/store";
import type { AppUser } from "$utils/types";

let newSupabaseUsers:AppUser[] = [];

export const supabaseUsers = writable(newSupabaseUsers)


export const setParticipants = (participants:AppUser[]) => {
    supabaseUsers.set(participants)
}