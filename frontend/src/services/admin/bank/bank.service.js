import httpService from "@/services/http.service";

export async function createNewBankApi(data) {
    return httpService
        .post(`/api/admin/bank/create`, data)
        .then(({ data }) => data);
}
export async function deleteBankById(id) {
    return httpService
        .delete(`/api/admin/bank/delete/${id}`)
        .then(({ data }) => data);
}
export async function getAllBankApi() {
    return httpService
        .get(`/api/admin/bank/get-all`)
        .then(({ data }) => data);
}