const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session'); //ezzel a sessionokat a mongodb-ben tudjuk tárolni

function createSessionStore() {
    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({ //felállítjuk a kapcsolatot az adatbázissal
        uri: 'mongodb://127.0.0.1:27017',
        databaseName: 'onlineshop',
        collection: 'sessions'
    });

    return store;
}

function createSessionConfig() {
    return { //a sessiont konfigurálni kell
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2*24*60*60*100 //eddig lesz érvényes a cookie, milisecundumban
        }
    };
}

module.exports = createSessionConfig;