const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title; //names used is new-products.ejs
    this.summary = productData.summary;
    this.price = +productData.price; //+: ténylegesen szám lesz eltárolva
    this.description = productData.description;
    this.image = productData.image; //name of the image file
    this.updateImageData();
    if (productData._id) {
      //ha van id
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;

    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404; //olyan id-nk van ami nincs az adatbázisban
      throw error;
    }

    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findAll() {
    //static: nem kell először egy konkrét objectet csinálni
    const products = await db.getDb().collection("products").find().toArray(); //mindegyiket 'megtalálja'

    return products.map(function (productDocument) {
      //a function lefut minden elemre
      return new Product(productDocument); //az adatbázis alapján megcsinálja az összes termékre az objektumot a Products alapján
    });
  }


  static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
      return new mongodb.ObjectId(id);
    })
    
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) {
      //ha updateljük a productot
      const productId = new mongodb.ObjectId(this.id); //át kell alakitanunk a string id-t a mongodb-s objectid-re

      if (!this.image) {
        delete productData.image; //kitörli az image key-value pairt, így a meglévő kép nem íródik felül undefined-re
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  async replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection('products').deleteOne({_id: productId}); //így is működik az await
  }

}

module.exports = Product;
