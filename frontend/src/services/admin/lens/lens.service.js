import httpService from "@/services/http.service";

// lens api
export async function createNewRefractiveIndexApi(data) {
  return httpService
    .post(`/api/admin/lens/create-refractive-index`, data)
    .then(({ data }) => data);
}

export async function getAllRefractiveIndexApi() {
  return httpService
    .get(`/api/admin/lens/all-refractive-index`)
    .then(({ data }) => data);
}

export async function deleteRefractiveIndexByIdApi(id) {
  return httpService
    .delete(`/api/admin/lens/delete-refractive-index/${id}`)
    .then(({ data }) => data);
}

export async function updateRefractiveIndexApi(id, data) {
  return httpService
    .patch(`/api/admin/lens/update-refractive-index/${id}`, data)
    .then(({ data }) => data);
}

export async function createNewLensTypeApi(data) {
  return httpService
    .post(`/api/admin/lens/create-type`, data)
    .then(({ data }) => data);
}
export async function getAllLensTypeApi() {
  return httpService
    .get(`/api/admin/lens/all-lens-type`)
    .then(({ data }) => data);
}
export async function deleteLensTypeById(id) {
  return httpService
    .delete(`/api/admin/lens/delete-lens-type/${id}`)
    .then(({ data }) => data);
}
export async function createNewLensCategoryApi(data) {
  return httpService
    .post(`/api/admin/lens/create-category`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data);
}
export async function getAllLensCategoriesApi() {
  return httpService
    .get(`/api/admin/lens/all-lens-categories`)
    .then(({ data }) => data);
}
export async function deleteLensCategoriesByIdApi(id) {
  return httpService
    .delete(`/api/admin/lens/delete-lens-category/${id}`)
    .then(({ data }) => data);
}
export async function createNewLensApi(data) {
  return httpService
    .post(`/api/admin/lens/create-new-lens`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data);
}
export async function getAllLensApi(page = 1, size = 10, search = "") {
  return httpService
    .get(`/api/admin/lens/all-lens`, {
      params: {
        page,
        size,
        search,
      },
    })
    .then(({ data }) => data);
}

export async function deleteLensByIdApi(id) {
  return httpService
    .delete(`/api/admin/lens/delete-lens/${id}`)
    .then(({ data }) => data);
}
export async function pricingLensApi(data) {
  return httpService
    .post(`/api/admin/lens/pricing`, data)
    .then(({ data }) => data);
}
