import jwt from "jsonwebtoken";

// это функция посредник
// решает можно ли возвращать какую-то секретную инфу

export default (req, res, next) => {
	// парсим токен
	// заменяем слово Bearer с помощью регулярных выражений
	const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

	if (token) {
		// если токен есть - мы должны его расшифровать
		try {
			const decoded = jwt.verify(token, "secret123");

			// если токен расшифрован успешно
			// получаем и сохраняем id пользователя
			req.userId = decoded._id;

			// все нормально, выполняй следующую функцию
			next();
		} catch (e) {
			// если мы не смогли расшифровать токен
			return res.status(403).json({
				message: "Нет доступа",
			});
		}
	} else {
		// если токена нет - возвращаем ошибку
		return res.status(403).json({
			message: "Нет доступа",
		});
	}
};
