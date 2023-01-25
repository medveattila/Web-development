function checkAuthStatus(req, res, next) {
    const uid = req.session.uid; //amikor meegcsináltuk a sessiont, és belogolt az user, akkor hozzá lett adva a sessionhoz az uid, így meg lehet nézni hogy be van e logolva

    if (!uid) { //tehát ha nincs belogolva
        return next(); //továbbirányítjuk a többi middlewarehez
    }

    res.locals.uid = uid; //ezeket globális változókba tároljuk, így a login adatokat bárhol elérjük
    res.locals.isAuth = true; //a globális változók csak egy requestig érvényesek, tehát ha logouttal töröljük az uid-t, a következő requestnél nem lesz igaz az isAuth
    res.locals.isAdmin = req.session.isAdmin
    next();
}

module.exports = checkAuthStatus;