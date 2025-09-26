import type { AxiosResponse } from "axios";
import axios from "axios";
import Cookies from "js-cookie";
import { messageApi } from "../utils/messageHelper";

const url = `${import.meta.env.VITE_APP_BACKEND_URL}`;

const instance = axios.create({
  baseURL: url,
});

// Global logout handler - will be set by AuthProvider
let globalLogoutHandler: (() => void) | null = null;

export const setGlobalLogoutHandler = (handler: () => void) => {
  globalLogoutHandler = handler;
};

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
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (!messageApi.current) {
      return Promise.reject(error);
    }
    if (status === 401) {
      // Don't handle 401 on login/signup pages to avoid infinite loops
      if (currentPath === "/login" || currentPath === "/signup") {
        return Promise.reject(error);
      }

      // Clear token immediately
      Cookies.remove("token");

      // Determine the error message based on the response
      const errorMessage =
        error.response?.data?.message || "Your session has expired.";
      const isTokenExpired =
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("invalid") ||
        errorMessage.toLowerCase().includes("token");

      // Show appropriate notification
      messageApi.current.warning(
        isTokenExpired
          ? "Your session has expired. Please log in again."
          : "Please log in to continue.",
        4
      );

      // Use global logout handler if available, otherwise fallback to window.location
      if (globalLogoutHandler) {
        setTimeout(() => {
          globalLogoutHandler!();
        }, 500); // Small delay to show the notification
      } else {
        // Fallback: redirect to login manually
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } else if (status === 403) {
      // Handle forbidden access
      messageApi.current.error(
        "You don't have permission to access this resource.",
        4
      );
    } else if (status >= 400 && status < 500) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      messageApi.current.error(errorMessage, 4);
    } else if (status >= 500) {
      // Handle server errors
      messageApi.current.error(
        "Something went wrong on our end. Please try refreshing the page.",
        4
      );
    }

    return Promise.reject(error);
  }
);

export { deleteRequest, getRequest, patchRequest, postRequest, putRequest };
