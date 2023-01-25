const Product = require("../models/product.model");

function getCart(req, res) { //betöltjük a cart-ot
  res.render('customer/cart/cart');
}

async function addCartItem(req, res) {
  let product;

  try {
    product = await Product.findById(req.body.productId); //megkeressük az adott id-jű productot az adatbázisba
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;

  cart.addItem(product);
  req.session.cart = cart; //itt adjuk hozzá a sessionhoz a cart adatait, req,session.save() automatikusan mukodik

  res.status(201).json({ //ajax-al fog menni, ezért adatot kuldunk vissza
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity

  }); 
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;

  const updatedItemData = cart.updateItem(req.body.productId, +req.body.quantity);

  req.session.cart = cart;

  res.json({
    message: 'Item updated!',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice

    }
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem
};
