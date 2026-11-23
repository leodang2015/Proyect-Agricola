export const ensureOwned = async (Model, id, ownerId) => {
  if (!id) {
    return null;
  }

  const record = await Model.findOne({ _id: id, ownerId }).lean();
  if (!record) {
    const error = new Error("Un recurso relacionado no existe o no te pertenece");
    error.status = 404;
    throw error;
  }

  return record;
};

export const preventDeleteWhenReferenced = async (Model, filter) => {
  if (await Model.exists(filter)) {
    const error = new Error("No se puede eliminar: el registro tiene información relacionada");
    error.status = 409;
    throw error;
  }
};
