import { createClient, type AuthChangeEvent, type UserCredentials } from "@supabase/supabase-js"

const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_KEY

let supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function getSupabaseClient(){
    let newClient = createClient(SUPABASE_URL, SUPABASE_KEY)
    return newClient
}

export {supabase, UserCredentials, getSupabaseClient}

const onAuthStateChange = function(event:AuthChangeEvent){
    console.log("supabase: " + event)
}

supabase.auth.onAuthStateChange(onAuthStateChange)
