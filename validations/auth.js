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
	body("passwordConfirmation", "Пароли не соответствуют").isLength({ min: 8 }),
	body("name", "Укажите имя").isLength({ min: 1 }),
	body("lastName", "Укажите имя").isLength({ min: 1 }),
	body("age", "Неверный формат возраста")
		.optional({ checkFalsy: true })
		.isNumeric(),
	body("sex", "Неверный формат пола").optional({ checkFalsy: true }),
	body("country", "Неверный формат страны").optional({ checkFalsy: true }),
	body("phoneNumber", "Неверный формат номера телефона")
		.optional({
			checkFalsy: true,
		})
		.isLength({ min: 10 }),
];
