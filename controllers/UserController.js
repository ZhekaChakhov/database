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
				message: "Пользователь не найден",
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
				message: "Неверный логин или пароль",
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
			massage: "Не удалось авторизоваться",
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

		// создаем юзера
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
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
			massage: "Не удалось зарегистрироваться",
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
				message: "Пользователь не найден",
			});
		}

		// если пользователь нашелся
		const { passwordHash, ...userData } = user._doc;

		// сохраняем все в res
		res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			massage: "Нет доступа",
		});
	}
};
