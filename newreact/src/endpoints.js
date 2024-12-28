const endpoint = {
  // Login endpoint
  LOGIN: `login`,
  // Logout endpoint
  LOGOUT: `logout`,
  // User list
  USER_DETAILS:`admindetails`,
  // Category endpoint
  CMS: `getcms`,
  CMS_all: `getallcms`,
  ADD_CMS: `cms/add`,
  UPDATE_CMS: `cms`,
  DELETE_CMS: `cms`,
  // content endpoint
  CMScONTENT: `cmsContent/get`,
  ADD_CMScONTENT: `cmsContent/add`,
  UPDATE_CMScONTENT: `cmsContent`,
  DELETE_CMScONTENT: `cmsContent`,

  //   Client endpoint
  CLIENT: `users`,
  ADD_CLIENT: `users/add`,
  UPDATE_CLIENT: `users`,
  DELETE_CLIENT: `users`,
  
  CAREER: `getcareer`,
  ADD_CAREER: `career/add`,
  UPDATE_CAREER: `career`,
  DELETE_CAREER: `career`,
  
  NEWS: `getnews`,
  ADD_NEWS: `news/add`,
  UPDATE_NEWS: `news`,
  DELETE_NEWS: `news`,
  
  INTEREST: `getinterest`,
  ADD_INTEREST: `interest/add`,
  UPDATE_INTEREST: `interest`,
  DELETE_INTEREST: `interest`,

  FEEDBACK:`getfeedback`,
  DELETE_FEEDBACK:`getfeedback`,
  ENQUIRY:`getenquiry`,
  DELETE_ENQUIRY:`getenquiry`,

  // Setting
  SETTING: `settings`,
  ADD_SETTING: `settings/add`,
  UPDATE_SETTING: `settings/update`,
  DELETE_SETTING: `settings/delete`,


};

export const ImageUrl = `http://localhost:3000/`;

export default endpoint;
