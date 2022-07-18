import { Twilio } from "twilio";
export const TWILIO_AUTH_TOKEN:string = import.meta.env.VITE_PUBLIC_AUTH_TOKEN;
export const TWILIO_ACCOUNT_SID:string = import.meta.env.VITE_PUBLIC_ACCOUNT_SID;
export const TWILIO_SERVICE_SID:string = import.meta.env.VITE_PUBLIC_SERVICE_SID;

const twilioClient =  new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


export {twilioClient}