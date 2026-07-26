
class APIError extends Error{

    constructor(
        statusCode , 
        message = "Something went wrong !!", 
        errorCode, 
        errors = [] , 
        stack = ""


    ){

        super(message)
        this.statusCode =  statusCode
        this.data = null
        this.message = message 
        this.errorCode = errorCode
        this.success = false, 
        this.errors = errors


        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }


    }
}


export default APIError