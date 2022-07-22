import { supabase } from "$lib/supabase";
import type { Participant } from "@twilio/conversations";
import { writable } from "svelte/store";
import type { AppUser } from "./user";

let newParticipants:Participant[] = [];
let newSupabaseUsers:AppUser[] = [];

export const participantList = writable(newParticipants)
export const supabaseUsers = writable(newSupabaseUsers)


export const getSupabaseUsersFromParticipants = async (participants:Participant[]) => {

    let users:AppUser[] = []
    for(let participant of participants){
        let { data, error } = await supabase.from('profiles').select().eq('id', participant.identity);
        if (error == null && data !== null) {
            users.push(data[0]);
        }
    }
    supabaseUsers.set(users)
}