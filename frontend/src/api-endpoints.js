const apis = {
  registrationAPI: "/api/users/register", // POST
  loginAPI: "/api/users/login", // POST
  getProfileInfoAPI: "/api/profile", // GET
  modifyExperienceAPI: "/api/profile/experience", // PUT
  deleteExperienceAPI: "/api/profile/experience", // DELETE
  modifyEducationAPI: "/api/profile/education", // PUT
  deleteEducationAPI: "/api/profile/education", // DELETE
  getAllProfilesAPI: "/api/profile/all", // GET
  getSingleProfileAPI: "/api/profile", // GET
  getGitReposAPI: "/api/profile/github", // GET
};
export default apis;
