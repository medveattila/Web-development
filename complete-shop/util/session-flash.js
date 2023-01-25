function getSessionData(req) {
    const sessionData = req.session.flashedData;

    req.session.flashedData = null;

    return sessionData;
}

function flashDataToSession(req, data, action) { //csak akkor haasználjuk az actiont, ha elmentettük a sessionba az adatokat
    req.session.flashedData = data;
    req.session.save(action);
}

module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
}