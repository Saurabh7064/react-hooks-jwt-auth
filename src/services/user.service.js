import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const API_URL_2 = "http://localhost:8080/api/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const getGroups = () => {
  return axios.get(API_URL_2 + "groups", { headers: authHeader() });
};
const getPosts = () => {
  return axios.get(API_URL_2 + "posts", { headers: authHeader() });
};

const saveGroup = groupName => {
  return axios.post(API_URL_2 + "group",{groupName}, { headers: authHeader() });

};

const savePost = post => {
  debugger;


  return axios.post(API_URL_2 + "post",{"postMessage":post.postMessage,"group":{"id":post.group.id}}, { headers: authHeader() });

};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getGroups,
  saveGroup,
  getPosts,
  savePost
};

export default UserService;
