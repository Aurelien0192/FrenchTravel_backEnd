const http_geocode = require('../utils/http').http_geocode
const keyApi = require('../config').keyApi

module.exports.ApiLocationServices =  class ApiLocationServices {
    static async getDataGeocode(params,callback){
        if(!params){
            const error ={
                msg : "query missing",
                type_error : "no-valid"
            }
            callback(error)
        }
        params.api_key = keyApi.getKeyGeocode()
       
        try{
            const data = await http_geocode.get(`search?`,{params})
            if(data.data.length !==0){
                callback(null,data.data)
            }else{
                const error = {
                    msg: "adress not found",
                    type_error:"no-found"
                }
                callback(error)
            }
        }catch (e){
            console.log(e)
            const error = {
                msg: "error with api geocode",
                type_error: "error_Api"
            }
            callback(e)
        }
    }
}