export function pageNotFound(req,res,next){
    const error = new Error(`the page is Not Found`);
    error.status = 404;
    next(error);
}

export function serverNotFound(err,req,res,next){
    res.status=err.status||500;
    res.json({
        error:{
            message:err.message
        }
    })
}

