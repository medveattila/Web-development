//A logint egy sessionba tároljuk

function createUserSession(req, user, action) {
    req.session.uid = user._id.toString(); //req.session: ez azért elérhető, mert haszjnáljuk a session packaget, utána meg bármit odaírhatunk, ezt fogja tárolni, _id: a mongodb által generált id
    req.session.isAdmin = user.isAdmin;
    req.session.save(action); //az action csak akkor fog lefutni, ha a session el lett rendesen tárolva az adatbázisba
}

function destroyUserAuthSession(req) { //kitöröljük az auth-related adatokat a sessionból
    req.session.uid = null;
    //req.session.save(); itt most nem feltétlenül kell
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
}