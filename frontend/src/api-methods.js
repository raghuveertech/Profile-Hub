import axios from "axios";
import apis from "./api-endpoints";

const {
  registrationAPI,
  loginAPI,
  getProfileInfoAPI,
  modifyExperienceAPI,
  modifyEducationAPI,
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

export const modifyExperience = async (body, token) => {
  const response = await putMethod(
    modifyExperienceAPI,
    body,
    postAuthConfig(token)
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
