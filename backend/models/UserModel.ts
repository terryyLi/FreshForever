import { Model, Schema, model } from 'mongoose';

export interface UserAttr {
	username: string;
	password: string;
}

export interface UserDocument extends Document {
	username: string;
	password: string;
	score: number;
}

export interface UserModel extends Model<UserDocument> {
	addOne(doc: UserAttr): UserDocument;
}

export const userSchema: Schema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		default: 0,
	},
});

userSchema.statics.addOne = (doc: UserAttr) => {
	return new User(doc);
};

export const User = model<UserDocument, UserModel>('User', userSchema);
