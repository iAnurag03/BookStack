// extension of the built in error class
class errorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statuscode= statusCode;
    }
}


export const errorMiddleware=(err, req, res, next)=>{
         //default
          err.message= err.message|| "internal server error";
          err.statusCode = err.statusCode||500;

         // mongodb duplicate key error
          if(err.code===11000){
            const statusCode=400;
            const message=`Duplicate field value entered`;
            err= new errorHandler(message, statusCode);
          }

          //invalid jwt error
          if(err.name==="JsonWebTokenError"){
            const statusCode=400;
            const message=`JWT  is invalid. try again`;
            err= new errorHandler(message, statusCode);

          }

          //jwt expired
          if(err.name==="TokenExpiredError"){
            const statusCode=400;
            const message=`JWT  is expired. try again`;
            err= new errorHandler(message, statusCode);

          }
          //invalid ID format , mongoDB cast error
          if(err.name =="CastError"){
            const statusCode=400;
            const message=`resource not found. Invalid path`;
            err= new errorHandler(message, statusCode);

          }

        const errorMessage= err.errors? Object.values(err.errors).map(error=>error.message).join(""):err.message;

        return res.status(err.statusCode).json({
            success:false,
            message:errorMessage
        });


};

export default errorHandler
