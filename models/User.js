import mongoose from "mongoose";

// создаем модель юзера
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		passwordConfirmation: {
			type: String,
			required: true,
		},
		age: String,
		sex: String,
		country: String,
		phoneNumber: String,
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", UserSchema);
