const Joi = require('joi');

const reviewSchema = Joi.object({
  productId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().min(3).max(255).required(),
  content: Joi.string().min(10).required(),
  pros: Joi.array().items(Joi.string()).default([]),
  cons: Joi.array().items(Joi.string()).default([]),
  verifiedPurchase: Joi.boolean().default(false),
  helpfulVotes: Joi.number().min(0).default(0),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
});

module.exports = reviewSchema;
