import axios from "axios";
import apis from "./api-endpoints";

const {
  registrationAPI,
  loginAPI,
  getProfileInfoAPI,
  updateProfileInfoAPI,
  getExperienceAPI,
  modifyExperienceAPI,
  deleteExperienceAPI,
  getEducationAPI,
  modifyEducationAPI,
  deleteEducationAPI,
  getAllProfilesAPI,
  getSingleProfileAPI,
  getGitReposAPI,
} = apis;

// configs
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const getAuthConfig = (token) => {
  return {
    headers: {
      "x-auth-token": token,
    },
  };
};

const postAuthConfig = (token) => {
  return {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  };
};

// common methods
const postMethod = async (url, body, config) => {
  const response = await axios.post(url, body, config);
  return response;
};

const getMethod = async (url, config) => {
  const response = await axios.get(url, config);
  return response;
};

const putMethod = async (url, body, config) => {
  const response = await axios.put(url, body, config);
  return response;
};

const deleteMethod = async (url, config) => {
  const response = await axios.delete(url, config);
  return response;
};

// specific API methods
export const registerUser = async (body) => {
  const response = await postMethod(registrationAPI, body, config);
  return response;
};

export const loginUser = async (body) => {
  const response = await postMethod(loginAPI, body, config);
  return response;
};

export const getProfileInfo = async (token) => {
  const response = await getMethod(getProfileInfoAPI, getAuthConfig(token));
  return response;
};

export const updateProfileInfo = async (body, token) => {
  const response = await postMethod(
    updateProfileInfoAPI,
    body,
    postAuthConfig(token)
  );
  return response;
};

export const getExperience = async (expId, token) => {
  const response = await getMethod(
    getExperienceAPI + "/" + expId,
    getAuthConfig(token)
  );
  return response;
};

export const modifyExperience = async (body, token) => {
  const response = await putMethod(
    modifyExperienceAPI,
    body,
    postAuthConfig(token)
  );
  return response;
};

export const deleteExperience = async (expId, token) => {
  const response = await deleteMethod(
    deleteExperienceAPI + "/" + expId,
    postAuthConfig(token)
  );
  return response;
};

export const getEducation = async (eduId, token) => {
  const response = await getMethod(
    getEducationAPI + "/" + eduId,
    getAuthConfig(token)
  );
  return response;
};

export const modifyEducation = async (body, token) => {
  const response = await putMethod(
    modifyEducationAPI,
    body,
    postAuthConfig(token)
  );
  return response;
};

export const deleteEducation = async (eduId, token) => {
  const response = await deleteMethod(
    deleteEducationAPI + "/" + eduId,
    postAuthConfig(token)
  );
  return response;
};

export const getAllProfiles = async () => {
  const response = await getMethod(getAllProfilesAPI);
  return response;
};

export const getSingleProfile = async (userId) => {
  const response = await getMethod(getSingleProfileAPI + "/" + userId);
  return response;
};

export const getGitRepos = async (gitHubUserName) => {
  const response = await getMethod(getGitReposAPI + "/" + gitHubUserName);
  return response;
};
