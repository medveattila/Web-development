const express = require('express'); //a dolgokat minden fájlba be kell importálni

const cartController = require('../controllers/cart.controller'); // ../: egy mappával feljebb ehhez a fájlhoz képest

const router = express.Router();

router.get('/', cartController.getCart); // /cart/

router.post('/items', cartController.addCartItem); // /cart/items

router.patch('/items', cartController.updateCartItem); //patch method: olyan requesteknél használjuk, ahol egy meglévő adat egy részét updateljük

module.exports = router; //így lehet egy fájlból exportálni a dolgokat, hogy a fájlt beimportálva máshol is elérhetőek legyenek