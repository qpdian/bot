class ErrorApplication extends Error {
    
    constructor(errorCode,errorMessage){
        super(errorMessage);
        this.statusCode  = errorCode
    }
    
    
}
module.exports = ErrorApplication;