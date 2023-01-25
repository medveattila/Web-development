const express = require('express'); //a dolgokat minden fájlba be kell importálni

const ordersController = require('../controllers/orders.controller'); // ../: egy mappával feljebb ehhez a fájlhoz képest

const router = express.Router();

router.post('/', ordersController.addOrder) // /orders/

router.get('/', ordersController.getOrders); // /orders/

router.get('/success', ordersController.getSucces);

router.get('/failure', ordersController.getFailure);


module.exports = router; //így lehet egy fájlból exportálni a dolgokat, hogy a fájlt beimportálva máshol is elérhetőek legyenek