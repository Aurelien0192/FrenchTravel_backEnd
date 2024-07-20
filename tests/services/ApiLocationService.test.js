const chai = require('chai') 
const e = require('express')
const ApiLocationServices = require("../../services/ApiLocationService").ApiLocationServices
let expect = chai.expect

const goodParams = {
    street : "52+rue+cuvier",
    city : "Exincourt",
    country : "France",
    postalCode : 25400
}

describe('get Geocode Response',() => {
    it('with good query - S',(done)=> {
        ApiLocationServices.getDataGeocode(goodParams, function(err, value){
            expect(value).to.be.a('Array')
            expect(value[0]).to.haveOwnProperty('display_name')
            expect(value[0]['display_name']).include('Rue Georges Cuvier')
            done()
        })
    })
    it('with query missing - E', (done) => {
        ApiLocationServices.getDataGeocode(null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(err).to.haveOwnProperty('msg')
            expect(err['msg']).to.include('missing')
            expect(value).to.be.undefined
            done()
        })
    })
    it('with query empty - E', (done) => {
        ApiLocationServices.getDataGeocode({}, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            expect(value).to.be.undefined
            done()
        })
    })
    it('with query wrong properties - E', (done) => {
        ApiLocationServices.getDataGeocode({dobby:"c'est le meilleur"}, function(err, value){
            console.log(err)
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(err).to.haveOwnProperty('msg')
            expect(err['msg']).to.include('allowed')
            done()
        })
    })
})