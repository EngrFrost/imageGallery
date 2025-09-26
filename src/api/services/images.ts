import { apiSlice } from '../apiSlice';
import { getRequest, postRequest } from '../apiUtils';

const getImages = async ({
  page,
  limit,
  color,
}: {
  page: number;
  limit: number;
  color: string;
}) => {
  const response = await getRequest(
    `/images?page=${page}&limit=${limit}&color=${color}`,
  );

  return { data: response.data };
};

const uploadImagesFn = async (formData: FormData) => {
  const response = await postRequest('/images/upload', formData);
  return { data: response.data };
};

export const imageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query({
      queryFn: getImages,
      providesTags: ['Images'],
    }),
    uploadImages: builder.mutation<void, FormData>({
      queryFn: uploadImagesFn,
      invalidatesTags: ['Images'],
    }),
  }),
});

export const { useGetImagesQuery, useUploadImagesMutation } = imageApi;
