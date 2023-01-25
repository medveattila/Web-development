const express = require('express'); //a dolgokat minden fájlba be kell importálni

const authController = require('../controllers/auth.controller'); // ../: egy mappával feljebb ehhez a fájlhoz képest

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', authController.signup); //nem baj, hogy ugyan az a route, mert az egyik egy get request a másik meg egy post

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router; //így lehet egy fájlból exportálni a dolgokat, hogy a fájlt beimportálva máshol is elérhetőek legyenek