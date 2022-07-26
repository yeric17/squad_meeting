import { writable } from "svelte/store"


export type AppNotification = {
    title:string,
    message:string,
    type:AppNotificationType
}

export type AppNotificationType = 'error' | 'alert' | 'success' | 'info'

export const emptyNotifications:AppNotification[] = []

export const notifications = writable(emptyNotifications)

export const addNotification = async function(notification:AppNotification, duration:number = 2000) {
    notifications.update( n =>{
        notification.message += " " + n.length
        if(n.indexOf(notification) > -1) return n;
        n = [notification,...n]
        return n
    })

    await new Promise(resolve=>{
        setTimeout(() => {
            notifications.update( n => {
                n.splice(n.indexOf(notification), 1)
                return n
            })
            resolve(true)
        }, duration);
    }) 
}

