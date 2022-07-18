import { writable, type Writable } from "svelte/store"

export type AppUser = {
    id: string,
    name: string,
    email: string,
    avatar: string,
    logged_in: boolean
}

export const appUser:Writable<AppUser> = writable<AppUser>({
    id: "",
    name: "",
    email: "",
    avatar: "",
    logged_in: false,
})