function protectRoutes(req, res, next) {
    if (!res.locals.isAuth) { //not authenticated
        return res.redirect('/401');
    }

    if (req.path.startsWith('/admin') && !res.locals.isAdmin) {  //ha admin felületet akarunk levédeni, így nézhetjük meg, hogy a request ezzel kezdődik-e
       return res.redirect('/403');
    }

    next(); //ha be vagyunk logolva és nem admin részre akarunk menni, vagy adminok vagyunk és admin részre akarunk menni, továbbenged a middleware

}

module.exports = protectRoutes;