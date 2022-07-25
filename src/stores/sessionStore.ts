import { supabase } from "$lib/supabase";
import type { User } from "@supabase/supabase-js";
import { writable } from "svelte/store";
import type {AppUser} from "./user";

let newAppUser:AppUser = {
    id: "",
    name: "",
    email: "",
    avatar: "",
    logged_in: false,
};

export const user = writable(newAppUser)

export const getEmptyUser = ():AppUser =>{
    return {
        id: "",
        name: "",
        email: "",
        avatar: "",
        logged_in: false,
    }
}

export const setUser = async (newUser:User|null) => {
    if(newUser == null){
        user.set(getEmptyUser())
        return;
    }

    let {data,error} = await supabase.from('profiles').select().eq('id',newUser.id).single()
    if(error){
        console.log(error)
        return;
    }
    if(data == null) return;

    const supaUser = data
    let newAppUser:AppUser = {
        id: supaUser.id,
        name: supaUser.user_name,
        email: supaUser.email,
        avatar: supaUser.avatar_url,
        logged_in: true,
    }
    user.set(newAppUser)
}