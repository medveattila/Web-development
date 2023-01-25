const Cart = require("../models/cart.model");

function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    //ha a felhasználó sessionjához nem tartozik cart, csinálunk egyet
    cart = new Cart();
  } else {
    const sessionCart = req.session.cart;
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    ); //ha van, akkor a sessionból ksizedjük az elemeket, és berakjuk újra, azért kell új, mert a session csak az adatokat tárolja, methodokat nem
  }

  res.locals.cart = cart;

  next();
}

module.exports = initializeCart;
