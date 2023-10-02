import { body } from "express-validator";

// проверка данных на валидность
export const registerValidation = [
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Неверный формат пароля")
		.isLength({
			min: 8,
		})
		.custom((value) => {
			return (
				!(value === value.toUpperCase()) &&
				!(value === value.toLowerCase()) &&
				/[0-9]/.test(value)
			);
		}),
	body("fullName", "Укажите имя").isLength({ min: 3 }),
	body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
