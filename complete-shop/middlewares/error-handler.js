function handleErrors(error, req, res, next) { //server-side error handling, ha valami baj van a szerverrel, ez a middleware fog lefutni
    console.log(error);

    if (error.code === 404) {
        return res.status(404).render('shared/404'); //ha rossz termék id-t írunk be a címsorba, "nem található" hibát fog dobni
    }

    res.status(500).render('shared/500');
}

module.exports = handleErrors;