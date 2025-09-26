import api from '../api';

export const getImages = async () => {
  const response = await api.get('/images');
  return response.data;
};

export const uploadImages = async (formData: FormData) => {
  const response = await api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const findSimilarImages = async (imageId: string) => {
  const response = await api.get(`/images/${imageId}/similar`);
  return response.data;
};

export const getImagesByColor = async (color: string) => {
  const response = await api.get(`/images/color/${color}`);
  return response.data;
};
