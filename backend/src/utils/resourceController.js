export const createResourceController = (service) => ({
  list: async (req, res) => {
    const result = await service.list(req.user.id, req.validatedQuery ?? req.query);
    res.status(200).json({
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit)
      }
    });
  },

  get: async (req, res) => {
    const item = await service.get(req.user.id, req.params.id);
    res.status(200).json({ data: item });
  },

  create: async (req, res) => {
    const item = await service.create(req.user.id, req.body);
    res.status(201).json({ data: item });
  },

  update: async (req, res) => {
    const item = await service.update(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ data: item });
  },

  remove: async (req, res) => {
    const item = await service.remove(req.user.id, req.params.id);
    res.status(200).json({ data: item });
  }
});
