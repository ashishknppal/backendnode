const { body, validationResult } = require('express-validator');

const validatebod = [
  body('name').notEmpty().withMessage('Name is required'),
  body('status').notEmpty().withMessage('Status is required'),
  body('Address').isLength({ min: 1, max: 255 }).withMessage('Address must be between 1 and 255 characters'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('office_number').optional().isNumeric().withMessage('Office number must be numeric'),
  body('Residence_Number').optional().isNumeric().withMessage('Residence number must be numeric'),
];

const checkValidationbod = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validatebod, checkValidationbod };
