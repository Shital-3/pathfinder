export default function errorHandler(error, req, res, next) {
	const statusCode = error.statusCode || 500;
	const message = statusCode >= 500 && process.env.NODE_ENV === "production"
		? "Internal server error"
		: error.message || "Internal server error";

	if (statusCode >= 500) {
		console.error(error);
	}

	res.status(statusCode).json({
		success: false,
		message,
	});
}
