import { Model, Schema, model } from 'mongoose';


export interface FoodAttr {
	user: Schema.Types.ObjectId;
	food: Schema.Types.ObjectId;
    expiration_date: Date;
    status: string;
    scored: boolean;
}

export interface FoodDocument extends Document {
	user: Schema.Types.ObjectId;
	food: Schema.Types.ObjectId;
    expiration_date: Date;
    status: string;
    scored: boolean;
}

export interface FoodModel extends Model<FoodDocument> {
	addOne(doc: FoodAttr): FoodDocument;
}

export const FoodSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    food: {
        type: Schema.Types.ObjectId,
        ref: "FoodCatalog",
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "undone"
    },
    scored: {
        type: Boolean,
        default: false
    }
});

FoodSchema.statics.addOne = (doc: FoodAttr) => {
	return new Food(doc);
};


export var Food = model('Food', FoodSchema)
