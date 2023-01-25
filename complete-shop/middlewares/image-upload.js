const multer = require('multer'); //file upload handling
const uuid = require('uuid').v4;

const upload = multer({
    storage: multer.diskStorage({
        destination: 'product-data/images',
        filename: function(req, file, cb) {
            cb(null, uuid() + '-' + file.originalname); //cb: callback function, uuid: egyedi azonosító generálása, originalname: eredeti név + kiterjesztés
        }
    })
});

const configuredMulterMiddleware = upload.single('image'); //egy fájlt tölt fel az adatbázisba image: az image upload form rész neve

module.exports = configuredMulterMiddleware;