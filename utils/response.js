module.exports.responseOfServer = function (err, value, req, res, created, next){
    if(err && (err.type_error === "no-valid" || err.type_error === "validator" || err.type_error === "duplicate")){
        res.statusCode = 405
        res.send(err)
    }else if(err && (err.type_error === "error-mongo" || err.type_error === "aborded")){
        res.statusCode = 500
        res.send(err)
    }else if(err && err.type_error ==='no-found'){
        res.statusCode = 404
        res.send(err)
    }else if(err && err.type_error === "unauthorized"){
        res.statusCode = 401
        res.send(err)
    }else{
        if(next){
            next()    
        }else{
            res.statusCode = created ? 201 : 200
            res.send(value)
        }
    }
}