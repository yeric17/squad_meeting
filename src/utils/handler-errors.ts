import type { RequestHandlerOutput, ResponseBody } from "@sveltejs/kit";

 

export const handleError = (status:number, message:string):RequestHandlerOutput<ResponseBody> =>{
    return {
        status: status,
        body: JSON.stringify(
            {
                message: message
            }
        )
    }
}