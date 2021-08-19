export const baseService = (model) => {
  const findOne = async (options, select = null, populate = null) => {
    // try {
    const item = await model.findOne(options, select).populate(populate);
    return item;
    // } catch (error) {
    //   throw error;
    // }
  };
  const create = async (data, option = null) => {
    try {
      const item = new model(data);
      return item.save(option);
    } catch (error) {
      throw error;
    }
  };
  const findOneAndUpdate = async (...options) => {
    try {
      const item = await model.findOneAndUpdate(...options);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const findOneAndDelete = async (...options) => {
    try {
      const item = await model.findOneAndDelete(...options);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const findByIdAndDelete = async (...options) => {
    try {
      const item = await model.findByIdAndDelete(...options);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const getById = async (id, select = null, populate = null) => {
    try {
      const item = await model.findById(id, select).populate(populate);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const getAll = async (
    condition = null,
    select = null,
    populate = null,
    page = null,
    perPage = null
  ) => {
    const item = model
      .find(condition, select)
      .populate(populate)
      .skip(page > 0 ? (page - 1) * perPage : 0)
      .limit(Number(perPage));
    return item;
  };
  return {
    getById,
    findOneAndUpdate,
    findOneAndDelete,
    findByIdAndDelete,
    create,
    findOne,
    getAll,
  };
};
