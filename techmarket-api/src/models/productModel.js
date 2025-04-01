const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(10).max(10000).required(),
  price: Joi.number().min(0).required(),
  stock_quantity: Joi.number().integer().min(0).required(),
  category: Joi.string().min(1).required(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
});

module.exports = productSchema;
