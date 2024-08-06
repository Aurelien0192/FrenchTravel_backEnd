module.exports.responseOfServer = function (err, value, req, res, created){
    if(err && (err.type_error === "no-valid" || err.type_error === "validator" || err.type_error === "duplicate")){
        res.statusCode = 405
        res.send(err)
    }else if(err && err.type_error === "error-mongo"){
        res.statusCode = 500
        res.send(err)
    }else if(err && err.type_error ==='no-found'){
        res.statusCode = 404
        res.send(err)
    }else{
        res.statusCode = created ? 201 : 200
        res.send(value)
    }
}