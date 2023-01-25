const express = require('express'); //a dolgokat minden fájlba be kell importálni



const router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/products'); 
});

router.get('/401', function(req, res) {
    res.status(401).render('shared/401');
});

router.get('/403', function(req, res) {
    res.status(403).render('shared/403');
});



module.exports = router; //így lehet egy fájlból exportálni a dolgokat, hogy a fájlt beimportálva máshol is elérhetőek legyenek