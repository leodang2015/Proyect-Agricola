export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error("No tienes permisos para realizar esta acción");
    error.status = req.user ? 403 : 401;
    return next(error);
  }

  return next();
};