const express = require('express');
const { getUsers, addUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { adminLogin,logout ,getAdminDetails ,uploadFile} = require('../controllers/adminController');
const { validateUser, checkValidation } = require('../validators/userValidator');
const { validatebod, checkValidationbod } = require('../validators/bodValidator');
const { enquiryRegister ,feedbackRegister,getfeedback,getenquiry} = require('../controllers/enquiryController');
const { getbod,getallbod, addBOD, getBODById, updateBOD, deleteBOD, getbankprocessor,getallbankprocessor, addbankprocessor, getbankprocessorById, updatebankprocessor, deletebankprocessor} = require('../controllers/bodController');
const { getcms,getallcms,addcms,getCMSById,updateCMS,deleteCMS,getcmsContent,getAllcmsContent,getcmsContentById,addcmsContent,updatecmsContent,deletecmsContent } = require('../controllers/cmsController');
const { getnews,getallnews,addnews,getnewsById,updatenews,deletenews ,getcareer,getAllcareer,getcareerById,addcareer,updatecareer,deletecareer ,getinterest,getAllinterest,getinterestById,addinterest,updateinterest,deleteinterest} = require('../controllers/careerNewsController');
const authenticateToken = require('../middleware/auth');
// const { upload } = require('./uploadConfig');

const router = express.Router();
router.post('/login', adminLogin);
router.post('/logout',authenticateToken, logout);
router.post('/admindetails',authenticateToken, getAdminDetails);

router.get('/users/', authenticateToken,getUsers);
router.post('/users/add',validateUser, checkValidation,addUser);
router.get('/users/:id',authenticateToken, getUserById);
router.put('/users/:id',authenticateToken,validateUser, updateUser);
router.delete('/users/:id',authenticateToken, deleteUser);

router.get('/getbod/', authenticateToken,getbod);
router.get('/getallbod/',getallbod);
router.post('/bod/add',authenticateToken, checkValidationbod,addBOD);
router.get('/bod/:id', getBODById);
router.put('/bod/:id',authenticateToken,checkValidationbod, updateBOD);
router.delete('/bod/:id',authenticateToken, deleteBOD);

router.get('/getbankprocessor/', authenticateToken,getbankprocessor);
router.get('/getallbankprocessor/',getallbankprocessor);
router.post('/bankproccess/add',authenticateToken,addbankprocessor);
router.get('/bankproccess/:id', getbankprocessorById);
router.put('/bankproccess/:id',authenticateToken,updatebankprocessor);
router.delete('/bankproccess/:id',authenticateToken, deletebankprocessor);

router.get('/getallnews/', getallnews);
router.get('/getnews/', authenticateToken,getnews);
router.post('/news/add',authenticateToken,addnews);
router.get('/news/:id', getnewsById);
router.put('/news/:id',authenticateToken, updatenews);
router.delete('/news/:id',authenticateToken, deletenews);

router.get('/getAllcareer/', getAllcareer);
router.get('/getcareer/', authenticateToken,getcareer);
router.post('/career/add',authenticateToken,addcareer);
router.get('/career/:id', getcareerById);
router.put('/career/:id',authenticateToken, updatecareer);
router.delete('/career/:id',authenticateToken, deletecareer);

router.get('/getAllinterest/', getAllinterest);
router.get('/getinterest/', authenticateToken,getinterest);
router.post('/interest/add',authenticateToken,addinterest);
router.get('/interest/:id', getinterestById);
router.put('/interest/:id',authenticateToken, updateinterest);
router.delete('/interest/:id',authenticateToken, deleteinterest);

router.get('/getcms/', getcms);
router.get('/getallcms/', getallcms);
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

// router.post('/uploadfile', uploadFile);

module.exports = router;
