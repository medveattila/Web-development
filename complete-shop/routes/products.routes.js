const express = require('express'); //a dolgokat minden fájlba be kell importálni

const productsController = require('../controllers/products.controller');



const router = express.Router();

router.get('/products', productsController.getAllProducts);

router.get('/products/:id', productsController.getProductDetails);

module.exports = router; //így lehet egy fájlból exportálni a dolgokat, hogy a fájlt beimportálva máshol is elérhetőek legyenek