export const validate = (schema, property = "body") => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    convert: true,
    stripUnknown: false
  });

  if (error) {
    return next(error);
  }

  if (property === "query") {
    req.validatedQuery = value;
  } else {
    req[property] = value;
  }
  return next();
};