import { body } from "express-validator";

// проверка данных на валидность
export const registerValidation = [
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Пароль должен быть минимум 8 символов").isLength({
		min: 8,
	}),
	body("fullName", "Укажите имя").isLength({ min: 3 }),
	body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
