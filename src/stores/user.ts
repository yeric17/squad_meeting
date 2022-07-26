import type { AppUser } from "$utils/types";
import { writable} from "svelte/store"

let defaultAppUser:AppUser = {
    id: "",
    name: "",
    email: "",
    avatar: "",
    logged_in: false,
};

export const appUser = writable(defaultAppUser)