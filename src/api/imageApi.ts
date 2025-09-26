import { apiSlice } from "./apiSlice";
import type { Image } from "../types/image";

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
    uploadImages: builder.mutation<any, FormData>({
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
