import { writable } from "svelte/store"

export type ChatState = 'idle' | 'input' | 'edit'

export const chatCurrentState = writable("idle")

export const updateChatState = (newState:ChatState) => {
    chatCurrentState.set(newState)
}