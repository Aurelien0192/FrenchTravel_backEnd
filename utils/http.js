const axios =require("axios")

module.exports.http_geocode = axios.create({
    baseURL: "https://geocode.maps.co/"
})