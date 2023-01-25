function addCsrfToken(req, res, next) {
    res.locals.csrfToken = req.csrfToken(); //ez a requestekhez hozzáadja a csrf tokent, és azt egy globális változóba tárolja
    next();
}

module.exports = addCsrfToken;