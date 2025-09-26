import type { AxiosResponse } from "axios";
import axios from "axios";
import Cookies from "js-cookie";

const url = "http://localhost:8000/api";

const instance = axios.create({
  baseURL: url,
});

async function getRequest(
  endpoint: string,
  params = {}
): Promise<AxiosResponse<any, any>> {
  return await instance.get(endpoint, { params });
}

async function postRequest(
  endpoint: string,
  body = {},
  settings = {}
): Promise<AxiosResponse<any, any>> {
  return await instance.post(endpoint, body, settings);
}

async function putRequest(
  endpoint: string,
  body = {},
  settings = {}
): Promise<AxiosResponse<any, any>> {
  return await instance.put(endpoint, body, settings);
}

async function patchRequest(
  endpoint: string,
  body = {}
): Promise<AxiosResponse<any, any>> {
  return await instance.patch(endpoint, body);
}

async function deleteRequest(
  endpoint: string,
  body = {}
): Promise<AxiosResponse<any, any>> {
  return await instance.delete(endpoint, { data: body });
}

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/login") {
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export { deleteRequest, getRequest, patchRequest, postRequest, putRequest };
