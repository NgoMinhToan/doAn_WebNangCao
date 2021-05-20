// Đại diện các tệp đa phương tiện
const mongoose = require('mongoose')
const MediaSchema = mongoose.Schema({
    originalname: {type: String, default: ''},
    uri: {type: String, required: true},
    path: {type: String},
    type: {type: String, required: true, default: 'image'},
    timeStamp: {type: Date, default: Date.now()},
})

const fs = require('fs')
const path = require('path')
MediaSchema.pre('insertMany', function(next, document){
    document = document.map(doc => {
        if(doc.type !== 'image') return next()
        let newDir = path.join(__dirname, '..', 'public', 'FileUpload', `${doc.user}`)
        let newUriDir = path.join('./FileUpload', `${doc.user}`)
        if(!fs.existsSync(newDir)){
            fs.mkdirSync(newDir)
        }
        let newUri = path.join(newUriDir, doc.originalname)
        let newPath = path.join(newDir, doc.originalname)
        let name = doc.originalname.replace(/\.\w+$/ig, '')
        let ext = doc.originalname.match(/\.\w+$/ig)
        let i = 1
        while(fs.existsSync(newPath)){
            newPath = path.join(newDir, `${name}(${i})${ext}`)
            newUri = path.join(newUriDir, `${name}(${i})${ext}`)
            i++
        }
        fs.renameSync(doc.uri, newPath)
        newUri = `/${newUri}`
        doc.path = newPath
        doc.uri = newUri
        return doc
    })
    next()
})
MediaSchema.pre('save', function(next){
    let doc = this
    let newDir = path.join(__dirname, '..', 'public', 'FileUpload', `${doc.user}`)
    let newUriDir = path.join('./FileUpload', `${doc.user}`)
    if(!fs.existsSync(newDir)){
        fs.mkdirSync(newDir)
    }
    let newUri = path.join(newUriDir, doc.originalname)
    let newPath = path.join(newDir, doc.originalname)
    let name = doc.originalname.replace(/\.\w+$/ig, '')
    let ext = doc.originalname.match(/\.\w+$/ig)
    let i = 1
    while(fs.existsSync(newPath)){
        newPath = path.join(newDir, `${name}(${i})${ext}`)
        newUri = path.join(newUriDir, `${name}(${i})${ext}`)
        i++
    }
    fs.renameSync(doc.uri, newPath)
    newUri = `/${newUri}`
    console.log(newPath)
    console.log(newUri)
    doc.path = newPath
    doc.uri = newUri
    next()
})
MediaSchema.pre('deleteOne', function (next) {
    let path = this._conditions.path
    fs.unlinkSync(path)
    console.log('Đã unlink file')
    next()
})

const Media = mongoose.model('Media', MediaSchema)

module.exports = Media