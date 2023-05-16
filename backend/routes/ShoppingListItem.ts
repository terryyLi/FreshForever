import express from "express";
import { ShoppingListItem } from "../models/index";
import { Model, Schema, model } from 'mongoose';

interface ShoppingListItemParams {
  user: Schema.Types.ObjectId;
  food: Schema.Types.ObjectId;
}

const router = express.Router();

// GET the shoppingList of a user. example url: localhost:3001/api/shoppinglist/643322cfe4d1d06feb9dd503
router.get("/:userID", async (req, res) => {
  try {
    // console.log(req.params.userID);
    // const result = await ShoppingListItem.find({}); // this does return all shoppingListItems in the DB
    const result = await ShoppingListItem.find({ user: req.params.userID });
    // console.log(result);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

// CREATE (multiple) shoppingList items.
// example of request body:
// [
//   {
//       "user": "643322cfe4d1d06feb9dd503",
//       "food": "64239b1bc3432f2b321ab762"
//   },
//   {
//       "user": "643322cfe4d1d06feb9dd503",
//       "food": "64239b1bc3432f2b321ab763"
//   }
// ]
router.post("/", async (req, res) => {
  try {
    const params: ShoppingListItemParams[] = req.body;
    const result = params.map(async (shoppingListItem: ShoppingListItemParams) => {
      const newShoppingListItem = await ShoppingListItem.create(shoppingListItem);
      return newShoppingListItem;
    });
    const finalResult = await Promise.all(result);
    res.json(finalResult);
  } catch (error) {
    res.json(error);
  }
});

// DELETE (multiple) shoppingList items by _id.
router.delete("/:shoppinglistID", async (req, res) => {
  try {
    const result = await ShoppingListItem.findByIdAndDelete(req.params.shoppinglistID);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

export const ShoppingListItemRoutes = router;
