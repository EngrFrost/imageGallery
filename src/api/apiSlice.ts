import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { Image } from "../types/image";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
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

export const imageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<Image[], { similarTo?: string; color?: string }>({
      query: ({ similarTo, color }) => {
        if (similarTo) {
          return `/images/${similarTo}/similar`;
        }
        if (color) {
          return `/images/color/${color}`;
        }
        return "/images";
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Images" as const, id })),
              { type: "Images", id: "LIST" },
            ]
          : [{ type: "Images", id: "LIST" }],
    }),
    uploadImages: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/images/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Images", id: "LIST" }],
    }),
  }),
});

export const { useGetImagesQuery, useUploadImagesMutation } = imageApi;
