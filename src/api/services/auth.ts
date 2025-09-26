import Cookies from "js-cookie";
import type { LoginCredentials } from "../../components/core/Login/formhelper";
import { apiSlice } from "../apiSlice";
import { getRequest, postRequest } from "../apiUtils";

const loginFn = async (credentials: LoginCredentials) => {
  const response = await postRequest("/auth/login", credentials);
  return { data: response.data };
};

const signupFn = async (credentials: LoginCredentials) => {
  const response = await postRequest("/user/register", credentials);
  return { data: response.data };
};

const getProfileFn = async () => {
  const response = await getRequest("/user/profile");
  return { data: response.data };
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string }, LoginCredentials>({
      queryFn: loginFn,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("token", data.access_token);
        } catch (error) {
          console.error(error);
        }
      },
    }),
    signup: builder.mutation<{ token: string }, LoginCredentials>({
      queryFn: signupFn,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("token", data.token);
        } catch (error) {
          console.error(error);
        }
      },
    }),
    getProfile: builder.query<{ email: string; userId: string }, void>({
      queryFn: getProfileFn,
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery } =
  authApi;
