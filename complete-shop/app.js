const path = require('path'); //így jobb az elérési utvonal mert ezt minden rendszer ismeri

const express = require('express');
const csrf = require('csurf'); //ezzel a package-val lehet a csrf attackok ellen védekezni
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes'); // .: relatív útvonal ehhez a fájlhoz képest
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');
const notFoundHandler = require('./middlewares/not-found');

const app = express();

//számít a sorrend, mert a requestek ebben a sorrendben érkeznek a middlewarekhez, és a funkciók is egymás után lesznek élesek

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) //__dirname: a konkrét project folder elérési útvonala

app.use(express.static('public')); //az ebben lévő fájlokat le lehet kérni publikus requestekkel
app.use('/products/assets', express.static('product-data')); //ugyan olyan mint az admin route-nál
//azért jó más url-t használni mint az eredeti mappa struktúra, hogy ne lássák a látogatók a struktúrát
app.use(express.urlencoded({extended: false})); //így már lehet a requestekből a bejövő adatokat kiolvasni
app.use(express.json()); //így tudunk olyan requestet fogadni amibe json adat van

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig)) //így lehet sessionokat létrehozni autheticationhoz, stbhez
app.use(csrf()); //minden nem get requestnek kell hogy legyen valid csrf tokenje, ez a middleware azt nézi

app.use(cartMiddleware); //így hogy ez itt van, a res.locals.cart mindenképp létezni fog
app.use(updateCartPricesMiddleware); //minden requesttel updateljük az userek kosarában lévő dolgokat
//pl ha menet közben árat módosítunk vagy dolgot törlünk, az látszódjon az usernél is

app.use(addCsrfTokenMiddleware); //nem kell (), mert ez a konkrét middleware function, és csak akkor kell lefusson, ha az adott request ideér

app.use(checkAuthStatusMiddleware); 

app.use(baseRoutes);
app.use(authRoutes); //middleware-t kell neki megadni, ami MINDEN requestet kezelni fog, tehát nem post vagy get vagy stb specifikus //az authRoutes fájlba vannak a request handlerek
app.use(productsRoutes);
app.use('/cart', cartRoutes)
app.use('/orders', protectRoutesMiddleware, ordersRoutes); //minden request ami /orderssel kezdődik, először átmegy a protect middlewaren
//igy levédi, de mégis tudjuk használni a not found middlewaret (adminnál ugyan ugy)
app.use('/admin', protectRoutesMiddleware, adminRoutes) //only paths that starts with /admin make it to the router

app.use(notFoundMiddleware); //minden olyan request, ami nincs kezelve máshol

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function() {
    app.listen(3000); //csak akkor indul el a szerver, ha sikerült az adatbázishoz csatlakozni
}).catch(function(error) {
    console.log('Failed to connect to the database!');
    console.log(error);
}); //minden async function promise-t fog returnolni automatikusan