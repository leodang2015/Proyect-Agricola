export const createResourceService = (Model, options = {}) => {
  const { populate = [], beforeSave, beforeDelete } = options;

  const applyPopulate = (query) =>
    populate.reduce(
      (populatedQuery, path) => populatedQuery.populate(path),
      query
    );
  const get = async (ownerId, id) => {
    const item = await applyPopulate(
      Model.findOne({ _id: id, ownerId })
    ).lean();
    if (!item) {
      throw notFound();
    }

    return item;
  };

  return {
    async list(ownerId, { page, limit }) {
      const filter = { ownerId };
      const [items, total] = await Promise.all([
        applyPopulate(
          Model.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
        ).lean(),
        Model.countDocuments(filter)
      ]);

      return { items, page, limit, total };
    },

    get,

    async create(ownerId, data) {
      const prepared = beforeSave
        ? await beforeSave({ ownerId, data })
        : data;
      const item = await Model.create({ ...prepared, ownerId });
      return get(ownerId, item.id);
    },

    async update(ownerId, id, data) {
      const existing = await Model.findOne({ _id: id, ownerId });
      if (!existing) {
        throw notFound();
      }

      const prepared = beforeSave
        ? await beforeSave({ ownerId, data, existing })
        : data;
      await Model.updateOne(
        { _id: id, ownerId },
        { $set: prepared },
        { runValidators: true }
      );
      return get(ownerId, id);
    },

    async remove(ownerId, id) {
      const existing = await Model.findOne({ _id: id, ownerId });
      if (!existing) {
        throw notFound();
      }

      if (beforeDelete) {
        await beforeDelete({ ownerId, id, existing });
      }

      const item = await Model.findOneAndDelete({ _id: id, ownerId });
      return item;
    }
  };
};

const notFound = () => {
  const error = new Error("Registro no encontrado");
  error.status = 404;
  return error;
};
