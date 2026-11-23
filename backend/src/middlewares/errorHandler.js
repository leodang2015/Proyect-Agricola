export const errorHandler = (error, _req, res, _next) => {
  if (error.isJoi) {
    return res.status(400).json({
      error: "Solicitud inválida",
      details: error.details.map(({ message, path }) => ({
        message,
        field: path.join(".")
      }))
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Los datos no cumplen las reglas del modelo",
      details: Object.values(error.errors).map(({ message, path }) => ({
        message,
        field: path
      }))
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: "El registro ya existe" });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Identificador o valor inválido" });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) {
    console.error(error);
  }

  return res.status(status).json({
    error: status >= 500 ? "Error interno del servidor" : error.message
  });
};