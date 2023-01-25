const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); //promise a return, async cucc, tehát a promise akkor lesz érvényes, ha lefutott, az async-awaittal viszont a többi
                                                                            //kód nem fut le amig ez nem végzett
    database = client.db('onlineshop') //mongodb-nél nem kell előre elkészíteni a dolgokat, hanem pl. ha erre csatlakozunk de még nincs ilyen, akkor elkészül
}

function getDb() {
    if (!database) {
        throw new Error('You must connect first!') //ha nincs db de csatlakozni akarunk, custom errort fog dobni
    }

    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}