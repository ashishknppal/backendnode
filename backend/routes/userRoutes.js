const express = require('express');
const { getUsers, addUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { adminLogin ,getAdminDetails} = require('../controllers/adminController');
const { validateUser, checkValidation } = require('../validators/userValidator');
const { validatebod, checkValidationbod } = require('../validators/bodValidator');
const { enquiryRegister ,feedbackRegister,getfeedback,getenquiry} = require('../controllers/enquiryController');
const { getbod,getallbod, addBOD, getBODById, updateBOD, deleteBOD} = require('../controllers/bodController');
const { getcms,getallcms,addcms,getCMSById,updateCMS,deleteCMS,getcmsContent,getAllcmsContent,getcmsContentById,addcmsContent,updatecmsContent,deletecmsContent } = require('../controllers/cmsController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.post('/login', adminLogin);
router.post('/admindetails',authenticateToken, getAdminDetails);

router.get('/users/', authenticateToken,getUsers);
router.post('/users/add',validateUser, checkValidation,addUser);
router.get('/users/:id',authenticateToken, getUserById);
router.put('/users/:id',authenticateToken,validateUser, updateUser);
router.delete('/users/:id',authenticateToken, deleteUser);

router.get('/getbod/', authenticateToken,getbod);
router.get('/getallbod/',getallbod);
router.post('/bod/add',authenticateToken,validatebod, checkValidationbod,addBOD);
router.get('/bod/:id', getBODById);
router.put('/bod/:id',authenticateToken,validatebod,checkValidationbod, updateBOD);
router.delete('/bod/:id',authenticateToken, deleteBOD);

router.get('/getcms/', authenticateToken,getcms);
router.post('/cms/add',authenticateToken,addcms);
router.get('/cms/:id', getCMSById);
router.put('/cms/:id',authenticateToken, updateCMS);
router.delete('/cms/:id',authenticateToken, deleteCMS);

router.get('/getallCMSContent/',getAllcmsContent);
router.get('/cmsContent/get', authenticateToken,getcmsContent);
router.post('/cmsContent/add',authenticateToken,addcmsContent);
router.get('/cmsContent/:id', getcmsContentById);
router.put('/cmsContent/:id',authenticateToken, updatecmsContent);
router.delete('/cmsContent/:id',authenticateToken, deletecmsContent);

router.post('/enquiry',enquiryRegister);
router.post('/feedback',feedbackRegister);
router.get('/getfeedback/', authenticateToken,getfeedback);
router.get('/getenquiry/', authenticateToken,getenquiry);


module.exports = router;
