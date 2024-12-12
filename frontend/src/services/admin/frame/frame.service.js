import httpService from "@/services/http.service";

export async function createFrameCategoryApi(data) {
  return httpService
    .post(`/api/admin/frame/create-category`, data)
    .then(({ data }) => data);
}

export async function getAllFrameCategoryApi() {
  return httpService
    .get(`/api/admin/frame/all-categories`)
    .then(({ data }) => data);
}

export async function deleteFrameCategoryByIdApi(id) {
  return httpService
    .delete(`/api/admin/frame/delete-category/${id}`)
    .then(({ data }) => data);
}
export async function createFrameTypeApi(data) {
  return httpService
    .post(`/api/admin/frame/create-type`, data)
    .then(({ data }) => data);
}

export async function getAllFrameTypeApi() {
  return httpService.get(`/api/admin/frame/all-types`).then(({ data }) => data);
}

export async function deleteFrameTypeByIdApi(id) {
  return httpService
    .delete(`/api/admin/frame/delete-type/${id}`)
    .then(({ data }) => data);
}

export async function createFrameGenderApi(data) {
  return httpService
    .post(`/api/admin/frame/create-gender`, data)
    .then(({ data }) => data);
}
export async function updateFrameApi(data) {
  return httpService
    .put(`/api/admin/frame/update-frame`, data)
    .then(({ data }) => data);
}

export async function getAllFrameGenderApi() {
  return httpService
    .get(`/api/admin/frame/all-genders`)
    .then(({ data }) => data);
}

export async function deleteFrameGenderByIdApi(id) {
  return httpService
    .delete(`/api/admin/frame/delete-gender/${id}`)
    .then(({ data }) => data);
}
export async function getFrameByIdApi(id, options) {
  return httpService
    .get(`/api/admin/frame/get-frame/${id}`, options)
    .then(({ data }) => data);
}
export async function deleteFrameByIdApi(id) {
  return httpService
    .delete(`/api/admin/frame/delete/${id}`)
    .then(({ data }) => data);
}

export async function createNewFrameApi(data) {
  return httpService
    .post(`/api/admin/frame/create-frame`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data);
}

export async function getAllFrameApi() {
  return httpService.get(`/api/admin/frame/all-frame`).then(({ data }) => data);
}
