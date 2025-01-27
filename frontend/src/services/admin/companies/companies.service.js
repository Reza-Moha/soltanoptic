import httpService from "@/services/http.service";

export async function createNewCompanyApi(data) {
  return httpService
    .post(`/api/admin/company/create`, data)
    .then(({ data }) => data);
}
export async function deleteCompanyById(id) {
  return httpService
    .delete(`/api/admin/company/delete/${id}`)
    .then(({ data }) => data);
}
export async function getAllCompaniesApi() {
  return httpService.get(`/api/admin/company/get-all`).then(({ data }) => data);
}
