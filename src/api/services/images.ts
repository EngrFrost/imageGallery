import { apiSlice } from '../apiSlice';
import { getRequest, postRequest } from '../apiUtils';

const getImages = async ({
  page,
  limit,
  color,
  search,
  similarTo,
}: {
  page: number;
  limit: number;
  color: string;
  search?: string;
  similarTo?: string;
}) => {
  let url = `/images?page=${page}&limit=${limit}`;
  if (color) url += `&color=${color}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (similarTo) url += `&similarTo=${similarTo}`;
  
  const response = await getRequest(url);

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
