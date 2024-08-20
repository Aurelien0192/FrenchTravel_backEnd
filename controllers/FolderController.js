const FolderService = require('../services/FolderService').FolderService
const responseOfServer = require('../utils/response').responseOfServer

module.exports.FolderController = class FolderController{

    static addOneFolder(req, res){
        FolderService.addOneFolder(req.user._id, req.body,null, function(err, value){
            responseOfServer(err, value, req, res, true)
        })
    }

    static findOneFolderById(req, res){
        FolderService.findOneFolderById(req.params.id, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static findManyFolders(req, res){
        FolderService.findManyFolders(req.query.page, req.query.limit, req.user._id, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static updateFolderById(req, res){
        FolderService.updateFolderById(req.params.id, req.body, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static deleteOneFolderById(req, res){
        FolderService.deleteOneFolderById(req.params.id, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }


}