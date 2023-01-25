const stripe = require("stripe")(
  "sk_test_51Jn9HNCIeJdaJkobVgYU76Gwu8dvoFinKbvDRhIim9GnPnpNtlbI4V5nMUWGRGZMh6qwKfSULapVpojEwwoLJaqi00ZeDhP0Yk"
);

const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}
async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;

  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    return next(error);
  }

  req.session.cart = null; //rendelés után eltávolítjuk a cartot teljesen

  //stripe payment (API) //amúgy valójában meg kéne nézni, hogy sikeres volt e a tranzakció, mert ha nem, így ugyan úgy megy az adatbázisba
  //mint ha sikeres lett volna, és törlődik a sessionból a cart

  const session = await stripe.checkout.sessions.create({
    //ez a session nem ugyan az mint a mi sessionunk, ez csak egy folyamat
    line_items: cart.items.map(function(item) { //a map átalakítja a meglévő dolgokat egy arrayban a megadott struktúrájú dologgá (minden 
      //itemre lefut)
      return {
        price_data: {
          //vagy lehetne a stripe oldalán tárolni az adatokat, és akkor egy termékhez tartozó id-t kéne megadni
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          unit_amount_decimal: +item.product.price.toFixed(2) * 100, //centben kéri az összeget
        },
        quantity: item.quantity,
      }
    }),
    mode: "payment",
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url); //a fizetés a stripe oldalán történik, biztonságosan
}

function getSucces(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSucces: getSucces,
  getFailure: getFailure
};
