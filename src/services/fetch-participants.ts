import { supabase } from "$lib/supabase";
import type { AppUser } from "$utils/types";
import type { Conversation, Participant } from "@twilio/conversations";

export const getParticipants = async (conversation:Conversation) => {

    let users:AppUser[] = []
    try {
        const participants:Participant[] = await conversation.getParticipants()

        const participantIds = participants.map( participant => participant.identity)

        let { data, error } = await supabase.from('profiles').select().in('id', participantIds)

        if(error){
            throw new Error("Error when get users from supabase");
        }

        if(data == null){
            throw new Error("Thera are not any participant in query");
        }

        users = participants.map(participant => {
            const user = data?.find(item => item.id === participant.identity)
            return {
                id: user.id,
                name: user.user_name,
                email: user.email,
                avatar: user.avatar_url,
                logged_in: false,
                participant: participant
            }
        })
    }
    catch(err){
        throw new Error("Error in fetching participants");
    }
    finally{
        return users;
    }
}