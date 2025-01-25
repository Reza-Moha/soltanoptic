import httpService from "@/services/http.service";

export async function createNewInsuranceApi(data) {
  return httpService
    .post(`/api/admin/insurance/create`, data)
    .then(({ data }) => data);
}
export async function deleteInsuranceById(id) {
  return httpService
    .delete(`/api/admin/insurance/delete/${id}`)
    .then(({ data }) => data);
}
export async function getAllInsuranceApi() {
  return httpService
    .get(`/api/admin/insurance/get-all`)
    .then(({ data }) => data);
}
