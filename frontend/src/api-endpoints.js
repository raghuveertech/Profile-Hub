const apiUrl = process.env.REACT_APP_API_BASE_URL;
console.log(process.env);
const apis = {
  registrationAPI: apiUrl + "/api/users/register", // POST
  loginAPI: apiUrl + "/api/users/login", // POST

  getProfileInfoAPI: apiUrl + "/api/profile", // GET
  updateProfileInfoAPI: apiUrl + "/api/profile", // POST
  updateProfilePictureAPI: apiUrl + "/api/profile/dp", // PUT

  getExperienceAPI: apiUrl + "/api/profile/experience", // GET
  modifyExperienceAPI: apiUrl + "/api/profile/experience", // PUT
  deleteExperienceAPI: apiUrl + "/api/profile/experience", // DELETE

  getEducationAPI: apiUrl + "/api/profile/education", // GET
  modifyEducationAPI: apiUrl + "/api/profile/education", // PUT
  deleteEducationAPI: apiUrl + "/api/profile/education", // DELETE

  getAllProfilesAPI: apiUrl + "/api/profile/all", // GET
  getSingleProfileAPI: apiUrl + "/api/profile", // GET

  getGitReposAPI: apiUrl + "/api/profile/github", // GET

  deleteProfileAPI: apiUrl + "/api/profile", // DELETE
};
export default apis;
