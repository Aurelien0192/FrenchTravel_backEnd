const http_geocode = require('../utils/http').http_geocode
const keyApi = require('../config').keyApi
const _ = require('lodash')

module.exports.ApiLocationServices =  class ApiLocationServices {
    static async getDataGeocode(params,callback){
        if(!params){
            const error ={
                msg : "query missing in the request",
                type_error : "no-valid"
            }
            callback(error)
        }else if(_.difference(Object.keys(params),["street","city","country","postalCode"]).length>0){
            let notAllowedProperties = _.difference(Object.keys(params),["street","city","country","postalCode"])
            notAllowedProperties = _.join(notAllowedProperties,' ')
            const error ={
                msg : `property ${notAllowedProperties} is not allowed`,
                fields_with_error: notAllowedProperties,
                fields: { [notAllowedProperties]: `The ${notAllowedProperties} is not allowed.` },
                type_error : "no-valid"
            }
            callback(error) 
        }
        params.api_key = keyApi.getKeyGeocode()
        try{
            const data = await http_geocode.get(`search?`,{params})
            setTimeout(() => {   
                if(data.data.length !==0){
                    return callback(null,data.data)
                }else{
                    const error = {
                        msg: "adress not found",
                        fields_with_error: ["street","codePostal","city","county"],
                        type_error:"no-found"
                    }
                    return callback(error)
                }
            },1000)
        }catch (e){
            const error = {
                msg: "error with api geocode",
                type_error: "error-api"
            }
            callback(error)
        }
    }
}