import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";

// подключение к базам данных
mongoose
	.connect(
		"mongodb+srv://admin:wwwwww@mycluster.8pnhwo3.mongodb.net/blog?retryWrites=true&w=majority&appName=AtlasApp"
	)
	.then(() => {
		console.log("DB ok");
	})
	.catch((err) => {
		console.log("DB error ", err);
	});

// создание express приложения
const app = express();

// разбираем входящие запросы в объект в формате JSON
// разобранные данные попадают в тело запроса (req.body)
app.use(express.json());

// POST запрос - создание ресурса
app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		// шифруем пароль
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		// создаем юзера
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash,
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

		// сохраняем все в res
		res.json({
			...user,
			token,
		});
	} catch (err) {
		// перехватываем ошибки
		console.log(err);
		res.status(500).json({
			massage: "Не удалось зарегистрироваться",
		});
	}
});

// регистрируем соединения по указанному адресу
app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK");
});
