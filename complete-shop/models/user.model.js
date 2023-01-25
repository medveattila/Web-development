const bcrypt = require('bcryptjs'); //érdemes először a beépített és a 3rd party package-ket importálni, majd a saját dolgokat
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
    constructor(email, password, fullname, street, postal, city) { //egy konkrét user elkészítésénel ez fut le automatikusan, ennek adjuk át a paramétereket
                                                                    //ha pl van email meg password, több nincs, akkor a többinek automatikusan undefined lesz az értéke

    this.email = email; //this: a konkrét, létrejövő objektumra mutat
    this.password = password;
    this.name = fullname;
    this.address = {
        street: street, //key:value
        postalCode: postal,
        city: city
        };
    }

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId);

       return db.getDb().collection('users').findOne({_id: uid}, { projection: {password: 0} }) //nem kell a jelszó itt az adatbázisból
    }

    getUserWithSameEmail() { //ellenőrizzük, hogy van e ilyen emaillel user
        return db.getDb().collection('users').findOne({email: this.email})
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) {
            return true;
        } else {
            return false;
        }
    }

    async signup() {

        const hashedPassword = await bcrypt.hash(this.password, 12); //a bcryptjs-el így lehet hashelni a jelszavakat, ez átalakítja egy random stringgé, a 2. paraméter: milyen erős legyen

        await db.getDb().collection('users').insertOne({ //egy database-n belüli collectiohoz csatlakozunk, majd egy documentet hozzáadunk
            email: this.email,
            //password: this.password, a jelszavakat nem szabad csak így simán tárolni, hanem hashelni kell
            password: hashedPassword,
            name: this.name,
            address: this.address //a noSQL adatbázisokba simán berakhatunk ilyen "nested object"-eket
        }); 
    }

    hasMatchingPassword(hashedPassword) { //ellenőrízzük a beírt jelszót, összehasonlítjuk a beírt jelszót a tárolt hashed jelszóval
        return bcrypt.compare(this.password, hashedPassword);
    }

}

module.exports = User;