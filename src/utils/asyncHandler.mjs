import { response } from "express";

// const asyncHandler = (func)=>{
//    return (request,response,next)=>{
//     Promise.resolve(func(request,response,next)).catch((err)=>next(err));
//    }
// }


const asyncHandler = (func) => {
    return async (request, response, next) => {
        try {
            await func(request, response, next);
        } catch (err) {
            next(err);
        }
    }

}


export { asyncHandler };