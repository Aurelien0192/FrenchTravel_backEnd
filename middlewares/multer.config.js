const multer = require('multer')
const path = require('path')

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'data/images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        if(extension !== undefined){
            callback(null, `${name}${Date.now()}.${extension}`)
        }else{
            callback({msg: "image format is not allowed", type_error:"no-valid"})
        }
    }
})

module.exports.oneImage = multer({
    storage,
    limits:{
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter:(req, file, callback) => {
        const acceptedExtentionsList = ['.jpg','.jpeg','.png']
        const extname = path.extname(file.originalname).toLowerCase()
        if(acceptedExtentionsList.includes(extname)){
            callback(null, true)
        }else{
            callback(null, false)
        }
    }    
}).single('image')

module.exports.manyImage = multer({storage,
    limits:{
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter:(req, file, callback) => {
        const acceptedExtentionsList = ['.jpg','.jpeg','.png']
        const extname = path.extname(file.originalname).toLowerCase()
        if(acceptedExtentionsList.includes(extname)){
            callback(null, true)
        }else{
            callback(null, false)
        }
    }}).array('images')
