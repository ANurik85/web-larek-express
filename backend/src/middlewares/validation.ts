import { celebrate, Joi, Segments } from 'celebrate';

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.string().uri().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
  }),
});

export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30),
    image: Joi.string().uri(),
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
  }),
});

export const validateObjId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string().hex().length(24).required(),
  }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().hex().length(24).required()).required(),
  }),
});
