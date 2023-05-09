const joi = require("joi");
const Joi = joi.extend(require('joi-phone-number'))

const signUpSchema = Joi.object({
  username: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().phoneNumber().required(),
  email: Joi.string().email().required(),
}).unknown(true)

const signInSchema = Joi.object({
  username: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
}).unknown(true)

exports.validateSignUp = (req, res, next) => {

  const isValidData = signUpSchema.validate(req.body, {
    abortEarly: false
  })

  const validationError = isValidData.error

  if (validationError) {
    console.log(validationError.details)
    return res.status(400).json({message: validationError.message})
  }

  next()
}

exports.validateSignIn = (req, res, next) => {

  const isValidData = signInSchema.validate(req.body, {
    abortEarly: false
  })

  const validationError = isValidData.error

  if (validationError) {
    console.log(validationError.details)
    return res.status(400).json({message: validationError.message})
  }

  next()
}
