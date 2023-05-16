import mongoose from "mongoose";
const { Schema, model } = mongoose;

/*

foodID: String          // id of the food
foodname: String            // name of the food
rottentime: Number   // integer - default days before food expires
category: String            // category of the food
image: String               // image path of the food

*/

const FoodCatalogSchema = new Schema({
  foodname: {
    type: String,
    default: "Default Food",
  },
  rottentime: {
    type: Number,
    default: 7,
  },
  category: {
    type: String,
    default: "Default Category",
  },
  image: {
    type: String,
  },
});

export var FoodCatalog = model('FoodCatalog', FoodCatalogSchema);
