import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";

// делаем авторизацию
export const login = async (req, res) => {
	try {
		// ищем пользователя по email
		const user = await UserModel.findOne({ email: req.body.email });

		// если его нет
		if (!user) {
			return res.status(404).json({
				// при полноценном приложении надо максимально поверхностно объяснить причину ошибки
				message: "The user was not found",
			});
		}

		// если он нашелся проверить сходятся ли пароли
		const isValudPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);

		// если не сходятся
		if (!isValudPass) {
			return res.status(400).json({
				message: "Invalid username or password",
			});
		}

		// если юзер нашелся и пароль корректный -
		// создаем новый токен
		const token = jwt.sign(
			{
				_id: user._id, // id
			},
			"secret123", // ключ, по которому расшифруется токен
			{
				expiresIn: "30d", // время жизни токена
			}
		);

		// вытаскиваем passwordHash
		const { passwordHash, ...userData } = user._doc;

		// сохраняем все в res
		res.json({
			...userData,
			token,
		});
	} catch (err) {
		// перехватываем ошибки
		console.log(err);
		res.status(500).json({
			massage: "Failed to log in",
		});
	}
};

// делаем регистрацию
export const register = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		// шифруем пароль
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		if (password !== req.body.passwordConfirmation) {
			return res.status(402).json({
				massage: "Passwords don't match",
			});
		}

		// создаем юзера
		const doc = new UserModel({
			email: req.body.email,
			name: req.body.name,
			lastName: req.body.lastName,
			passwordHash: hash,
			passwordConfirmation: hash,
			age: req.body.age,
			sex: req.body.sex,
			country: req.body.country,
			phoneNumber: req.body.phoneNumber,
		});

		// сохраняем юзера
		const user = await doc.save();

		// создаем токен
		const token = jwt.sign(
			{
				_id: user._id,
			},
			"secret123",
			{
				expiresIn: "30d",
			}
		);

		// вытаскиваем passwordHash
		const { passwordHash, ...userData } = user._doc;

		// сохраняем все в res
		res.json({
			...userData,
			token,
		});
	} catch (err) {
		// перехватываем ошибки
		console.log(err);
		res.status(500).json({
			massage: "Failed to register",
		});
	}
};

// получаем инфу о пользователе
export const getMe = async (req, res) => {
	try {
		// найти пользователя по id
		const user = await UserModel.findById(req.userId);

		if (!user) {
			// если пользователя нет
			return res.status(404).json({
				message: "User was not found",
			});
		}

		// если пользователь нашелся
		const { passwordHash, ...userData } = user._doc;

		// сохраняем все в res
		res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			massage: "No access",
		});
	}
};
