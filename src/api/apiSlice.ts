import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_APP_BACKEND_URL}/api`,
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Images"],
  endpoints: () => ({}),
});
