class customErrors extends Error{
    constructor(
        statuscode, message, stack
    ){
       super();
       this.statusCode = statuscode;
       this.message = message;
       this.data = null;
       
       if(!stack){
        this.stack = Error.captureStackTrace(this, this.constructor);
       }else{
        this.stack = Error.stack
       }
    }
}

export {customErrors};