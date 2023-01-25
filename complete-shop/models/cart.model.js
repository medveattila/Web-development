
const Product = require('./product.model');

class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0 ) { //default: üres array
        this.items = items,
        this.totalQuantity = totalQuantity,
        this.totalPrice = totalPrice
    }

    async updatePrices() {
        const productIds = this.items.map(function (item) {
          return item.product.id;
        });
    
        const products = await Product.findMultiple(productIds);
    
        const deletableCartItemProductIds = [];
    
        for (const cartItem of this.items) {
          const product = products.find(function (prod) {
            return prod.id === cartItem.product.id;
          });
    
          if (!product) {
            // product was deleted!
            // "schedule" for removal from cart
            deletableCartItemProductIds.push(cartItem.product.id);
            continue;
          }
    
          // product was not deleted
          // set product data and total price to latest price from database
          cartItem.product = product;
          cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
        }
    
        if (deletableCartItemProductIds.length > 0) {
          this.items = this.items.filter(function (item) {
            return deletableCartItemProductIds.indexOf(item.product.id) < 0;
          });
        }
    
        // re-calculate cart totals
        this.totalQuantity = 0;
        this.totalPrice = 0;
    
        for (const item of this.items) {
          this.totalQuantity = this.totalQuantity + item.quantity;
          this.totalPrice = this.totalPrice + item.totalPrice;
        }
      }

    addItem(product) { //a kosárba rakott dologkat az userhez kötött sessionba tároljuk, így be se kell logolni a kosárba rakáshoz, mert minden látogatóhoz tartozik egy egyedi session

        const cartItem = { //a kosárban egy objektumot tárolunk, így nyomon tudjuk követni a mennyiséget és az árat is
            product: product,
            quantity: 1,
            totalPrice: product.price
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === product.id) { //megnézzük, hogy van-e már ilyen dolog a kosárba, ha igen, ,öveljük a mennyiséget
                cartItem.quantity = +item.quantity + 1; //azért tudjuk változtatni a const ellenére is, mert az objectek (és arrayok) reference value-ként vannak kezelve JS-ben, tehát csak a 
                                                            //memóriacím van tárolva konstansként (pointer), és az nem is változik
                cartItem.totalPrice = item.totalPrice + product.price;
                this.items[i] = cartItem;

                this.totalQuantity++; //eggyel növeljük a mennyiséget
                this.totalPrice += product.price //product price-t hozzaadjuk a totalhoz
                return;
            }
        }
        this.items.push(cartItem); //az arrayoknak van push methodjuk, amivel az array végére berakhatunk új elementet
        this.totalQuantity++; //eggyel növeljük a mennyiséget
        this.totalPrice += product.price //product price-t hozzaadjuk a totalhoz
    }

    updateItem(productId, newQuantity) {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === productId && newQuantity > 0) { 
                
                const cartItem = {...item};
                const quantityChange = newQuantity - item.quantity; //item.quantity: a régi mennyiség
                cartItem.quantity = newQuantity;
                cartItem.totalPrice = newQuantity * item.product.price;
                this.items[i] = cartItem;

                this.totalQuantity = this.totalQuantity + quantityChange ; 
                this.totalPrice += quantityChange * item.product.price 
                return {updatedItemPrice: cartItem.totalPrice};
            } else if (item.product.id === productId && newQuantity <= 0) {
                this.items.splice(i, 1); //ezzel ki tudjuk szedni az i. element az arrayból, 1: ennyi elemet szedünk ki onnantól 
                this.totalQuantity = this.totalQuantity -item.quantity; 
                this.totalPrice -= item.totalPrice;
                return {updatedItemPrice: 0};
            }
        }
        


    }
}

module.exports = Cart;