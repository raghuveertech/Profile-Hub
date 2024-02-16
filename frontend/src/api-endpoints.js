const apis = {
  registrationAPI: "/api/users/register", // POST
  loginAPI: "/api/users/login", // POST

  getProfileInfoAPI: "/api/profile", // GET
  updateProfileInfoAPI: "/api/profile", // POST

  getExperienceAPI: "/api/profile/experience", // GET
  modifyExperienceAPI: "/api/profile/experience", // PUT
  deleteExperienceAPI: "/api/profile/experience", // DELETE

  getEducationAPI: "/api/profile/education", // GET
  modifyEducationAPI: "/api/profile/education", // PUT
  deleteEducationAPI: "/api/profile/education", // DELETE

  getAllProfilesAPI: "/api/profile/all", // GET
  getSingleProfileAPI: "/api/profile", // GET

  getGitReposAPI: "/api/profile/github", // GET
};
export default apis;
