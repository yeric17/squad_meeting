import { writable} from "svelte/store"

export type AppUser = {
    id: string,
    name: string,
    email: string,
    avatar: string,
    logged_in: boolean
}


let defaultAppUser:AppUser = {
    id: "",
    name: "",
    email: "",
    avatar: "",
    logged_in: false,
};

export const appUser = writable(defaultAppUser)