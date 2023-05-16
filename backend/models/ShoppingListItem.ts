import { Document, Model, Schema, model } from "mongoose";

export interface ShoppingListItemAttr {
  user: Schema.Types.ObjectId;
  food: string;
}

export interface ShoppingListItemDocument extends Document {
  user: Schema.Types.ObjectId;
  food: string;
}

export interface ShoppingListItemModel extends Model<ShoppingListItemDocument> {
  addOne(doc: ShoppingListItemAttr): Promise<ShoppingListItemDocument>;
}

const ShoppingListItemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  food: {
    type: String,
    required: true,
  },
});

ShoppingListItemSchema.statics.addOne = function(doc: ShoppingListItemAttr) {
  return new ShoppingListItem(doc);
};

export const ShoppingListItem: ShoppingListItemModel = model<ShoppingListItemDocument, ShoppingListItemModel>('ShoppingListItem', ShoppingListItemSchema);
