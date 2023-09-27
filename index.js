import express from "express";

import mongoose from "mongoose";

import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";

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

app.post("/auth/login", UserController.login);

app.post("/auth/register", registerValidation, UserController.register);

app.get("/auth/me", checkAuth, UserController.getMe);

// регистрируем соединения по указанному адресу
app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK");
});
