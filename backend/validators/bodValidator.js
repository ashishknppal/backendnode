const { body, validationResult } = require('express-validator');

const validatebod = [
  body('salutation').isIn(['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']).withMessage('Invalid salutation'),
  body('fname').isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lname').isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
  body('account_type').notEmpty().withMessage('Account type is required'),
  body('postcode').matches(/^\d{6}$/).withMessage('Postcode must be 6 digits'),
  body('prefered_language').isIn(['Hindi', 'English', 'Other']).withMessage('Invalid preferred language'),
  body('agree').isInt({ min: 0, max: 1 }).withMessage('Agree must be 0 or 1'),
];

const checkValidationbod = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validatebod, checkValidationbod };
