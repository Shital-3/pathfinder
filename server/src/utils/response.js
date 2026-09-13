export function success(res, data = {}, message = "Operation successful", statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
