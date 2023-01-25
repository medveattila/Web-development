const express = require('express'); //a dolgokat minden fájlba be kell importálni

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');


const router = express.Router();

router.get('/products', adminController.getProducts); //we can use this way beacuse the /admin in the app.js

router.get('/products/new', adminController.getNewProduct);

router.post('/products', imageUploadMiddleware ,adminController.createNewProduct);

router.get('/products/:id', adminController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware ,adminController.updateProduct);

router.delete('/products/:id', adminController.deleteProduct); //ajax request kezelés

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

module.exports = router; //így lehet egy fájlból exportálni a dolgokat, hogy a fájlt beimportálva máshol is elérhetőek legyenek