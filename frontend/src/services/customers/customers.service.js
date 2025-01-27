import httpService from "@/services/http.service";

export async function createNewInvoiceApi(data) {
  return httpService
    .post(`/api/admin/customers/create-new-invoice`, data)
    .then(({ data }) => data);
}
